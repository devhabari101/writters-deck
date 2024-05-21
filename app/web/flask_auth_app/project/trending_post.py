import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Ensure the correct import path

def get_latest_post():
    latest_post = None
    latest_date = None

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
                post_date_str = metadata_dict.get('date')
                if post_date_str:
                    post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                    if not latest_date or post_date > latest_date:
                        latest_date = post_date
                        latest_post = {
                            "metadata": metadata_dict,
                            "content": markdown.markdown(content)
                        }

    # Remove <p> tags from the HTML content
    if latest_post:
        latest_post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', latest_post["content"])

    return latest_post
def get_second_latest_post():
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
                post_date_str = metadata_dict.get('date')
                if post_date_str:
                    post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                    posts.append({
                        "metadata": metadata_dict,
                        "content": markdown.markdown(content),
                        "date": post_date
                    })

    # Sort posts by date in descending order
    sorted_posts = sorted(posts, key=lambda x: x["date"], reverse=True)

    # Get the second latest post
    if len(sorted_posts) >= 2:
        second_latest_post = sorted_posts[1]
        # Remove <p> tags from the HTML content
        second_latest_post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', second_latest_post["content"])
        return second_latest_post
    else:
        return None
