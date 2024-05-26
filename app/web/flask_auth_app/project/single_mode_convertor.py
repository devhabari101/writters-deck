import os
import markdown
import json
import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Directory containing Markdown files
markdown_dir = "content"
json_output_file = "markdown_output.json"

# Function to save form data to Markdown file with user_id
def save_to_markdown(data, user_id):
    # Create a filename based on current timestamp or unique identifier
    filename = os.path.join(markdown_dir, f"{data['title']}.md")
    # Write form data to Markdown file
    with open(filename, "w") as file:
        file.write(f"---\n")
        for key, value in data.items():
            file.write(f"user_id: {user_id}\n")  # Add user_id to metadata
        file.write(f"---\n\n{data['content']}")

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

# Define a custom event handler to monitor file system changes
class MarkdownFileEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.event_type in ('created', 'modified'):
            if event.src_path.endswith(".md"):
                convert_markdown_to_json()

if __name__ == "__main__":
    # If the script is executed directly, run the conversion process
    convert_markdown_to_json()
