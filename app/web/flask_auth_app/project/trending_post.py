import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Ensure the correct import path

def list_trending_post(index):
    trending_post = None
    trending_counter = 0

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
                # Check if the post is trending
                if metadata_dict.get('trending') == 'on':
                    trending_counter += 1
                    if trending_counter == index:
                        post_date_str = metadata_dict.get('date')
                        if post_date_str:
                            post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                            trending_post = {
                                "metadata": metadata_dict,
                                "content": markdown.markdown(content),
                                "date": post_date
                            }
                        break  # Exit the loop once we find the post at the desired index

    # Remove <p> tags from the HTML content
    if trending_post:
        trending_post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', trending_post["content"])

    return trending_post

def get_latest_post():
    return list_trending_post(1)  # Get the latest trending post

def get_second_latest_post():
    return list_trending_post(2)  # Get the second latest trending post
