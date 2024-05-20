import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Import markdown_dir

def read_markdown_files():
    posts = []
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
                posts.append(post)
    return posts

def list_all_posts():
    return read_markdown_files()

def list_trending_post():
    trending_post = None
    latest_date = None
    posts = read_markdown_files()

    for post in posts:
        metadata = post['metadata']
        if metadata.get('trending') == 'on':
            post_date_str = metadata.get('date')
            if post_date_str:
                post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                if not latest_date or post_date > latest_date:
                    latest_date = post_date
                    trending_post = post

    return trending_post
