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
        file.write("---\n")
        file.write(f"user_id: {user_id}\n")
        file.write(f"title: {data['metadata']['title']}\n")
        file.write(f"category: {data['metadata']['category']}\n")
        file.write(f"date: {data['metadata']['date']}\n")
        file.write(f"trending: {data['metadata']['trending']}\n")
        file.write(f"topPick: {data['metadata']['topPick']}\n")
        file.write(f"popular: {data['metadata']['popular']}\n")
        file.write(f"link: {data['metadata']['link']}\n")
        file.write("---\n\n{data['content']}")
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
    form_data = {
        "title": request.form.get("title"),
        "Image": request.form.get("Image"),
        "imageAttribution": request.form.get("imageAttribution"),
        "category": request.form.get("category"),
        "date": request.form.get("date"),
        "trending": request.form.get("trending"),
        "topPick": request.form.get("topPick"),
        "popular": request.form.get("popular"),
        "link": request.form.get("link"),
        "content": request.form.get("content"),
        "metadata": {
            "title": request.form.get("title"),
            "category": request.form.get("category"),
            "date": request.form.get("date"),
            "trending": request.form.get("trending"),
            "topPick": request.form.get("topPick"),
            "popular": request.form.get("popular"),
            "link": request.form.get("link")
        }
    }
    user_id = current_user.id
    save_to_markdown(form_data, user_id)
    return redirect(url_for("main.index"))

@convertor_blueprint.route('/markdown_output.json')
def get_markdown_output():
    # Assuming markdown_output.json is in the root directory
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    return send_file(json_file_path)
    
