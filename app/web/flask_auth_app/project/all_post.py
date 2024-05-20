# all_post.py
import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Import markdown_dir

def list_all_posts():
    all_posts = []
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
                # Remove <p> tags from the HTML content
                html_content = re.sub(r'<p>(.*?)</p>', r'\1', html_content)
                post = {
                    "metadata": metadata_dict,
                    "content": html_content
                }
                all_posts.append(post)
    return all_posts
