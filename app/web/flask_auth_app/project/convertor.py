import os
import markdown
import json
import re
from flask import Blueprint, render_template, send_file, request, redirect, url_for, current_app
from flask_login import current_user, login_required, LoginManager  # Correct import
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

convertor_blueprint = Blueprint('convertor', __name__)
login_manager = LoginManager()  # Correct initialization
login_manager.login_view = 'auth.login'

# Directory containing Markdown files
markdown_dir = "content"
json_output_file = "markdown_output.json"

# Function to save form data to Markdown file
def save_to_markdown(data, user_id):
    # Create a filename based on the form title
    filename = os.path.join(markdown_dir, f"{data['title']}.md")
    # Write form data to Markdown file
    with open(filename, "w") as file:
        file.write(f"---\n")
        file.write(f"title: {data['title']}\n")
        file.write(f"image_url: {data['image_url']}\n")  # Include image URL field
        file.write(f"imageAttribution: {data['imageAttribution']}\n")
        file.write(f"date: {data['date']}\n")
        file.write(f"category: {data['category']}\n")
        file.write(f"trending: {data['trending']}\n")
        file.write(f"topPick: {data['topPick']}\n")
        file.write(f"popular: {data['popular']}\n")
        file.write(f"link: {data['link']}\n")
        file.write(f"body: {data['body']}\n")
        file.write(f"youtube_link: {data['youtube_link']}\n")  # New field
        file.write(f"user_id: {user_id}\n")
        file.write(f"---\n\n{data['content']}")
    print(f"Markdown file saved: {filename}")

# Function to convert Markdown to HTML and update JSON file
def convert_markdown_to_json():
    json_data_list = []
    for filename in os.listdir(markdown_dir):
        if filename.endswith(".md"):
            with open(os.path.join(markdown_dir, filename), "r", encoding="utf-8") as file:
                markdown_content = file.read()
            metadata_match = re.match(r'^---(.*?)---(.*)', markdown_content, re.DOTALL)
            if metadata_match:
                metadata, content = metadata_match.groups()
                metadata_dict = {}
                for line in metadata.strip().split('\n'):
                    key_value = line.split(':', 1)
                    if len(key_value) == 2:
                        key, value = key_value
                        metadata_dict[key.strip()] = value.strip()
                html_content = markdown.markdown(content)
                json_data = {
                    "metadata": metadata_dict,
                    "content": html_content
                }
                json_data_list.append(json_data)
            else:
                print(f"Could not parse metadata in file: {filename}")
    with open(json_output_file, "w", encoding="utf-8") as output_file:
        json.dump(json_data_list, output_file, indent=4)
    print(f"JSON file updated: {json_output_file}")

# Define a custom event handler to monitor file system changes
class MarkdownFileEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.event_type in ('created', 'modified'):
            if event.src_path.endswith(".md"):
                convert_markdown_to_json()

# Start the watchdog observer to monitor file system changes
event_handler = MarkdownFileEventHandler()
observer = Observer()
observer.schedule(event_handler, path=markdown_dir, recursive=True)
observer.start()

@convertor_blueprint.route("/admin", methods=["GET"])
@login_required
def form_admin():
    return render_template("form.html")

@convertor_blueprint.route("/submit", methods=["POST"])
@login_required
def submit_form():
    # Get the title, category, content, and metadata from the form
    title = request.form.get("title")
    image_url = request.form.get("image_url", "")  # Initialize with empty string if not provided
    imageAttribution = request.form.get("imageAttribution", "")  # Initialize with empty string if not provided
    date = request.form.get("date")
    category = request.form.get("category")
    content = request.form.get("content")
    
    # Get additional metadata fields from the form
    trending = request.form.get("trending")
    top_pick = request.form.get("topPick")
    popular = request.form.get("popular")
    link = request.form.get("link")
    body = request.form.get("body", "")  # Initialize with empty string if not provided
    youtube_link = request.form.get("youtube_link", "")  # New field for YouTube link
    user_id = current_user.id
    
    # Construct the form data dictionary including all fields
    form_data = {
        "title": title,
        "image_url": image_url,
        "imageAttribution": imageAttribution,
        "date": date,
        "category": category,
        "content": content,
        "trending": trending,
        "topPick": top_pick,
        "popular": popular,
        "link": link,
        "body": body,
        "youtube_link": youtube_link,  # Include the YouTube link in the form data
        "user_id": user_id
    }

    # Save the form data to Markdown file
    try:
        save_to_markdown(form_data, user_id)
    except Exception as e:
        # Handle file save error gracefully
        print(f"Error saving Markdown file: {e}")
        return "An error occurred while saving the form data.", 500
    
    # Redirect to the index page
    return redirect(url_for("main.index"))


@convertor_blueprint.route('/markdown_output.json')
def get_markdown_output():
    # Assuming markdown_output.json is in the root directory
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    return send_file(json_file_path)
    
