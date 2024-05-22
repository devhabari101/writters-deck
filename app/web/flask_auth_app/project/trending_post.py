import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Ensure the correct import path

def list_trending_post(index):
    trending_posts = []

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
                        post_date_str = metadata_dict.get('date')
                        if post_date_str:
                            post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                            trending_posts.append({
                                "metadata": metadata_dict,
                                "content": markdown.markdown(content),
                                "date": post_date
                            })

    # Sort trending posts by date in descending order
    trending_posts.sort(key=lambda post: post['date'], reverse=True)

    # Ensure the index is within the range of available trending posts
    index = min(index, len(trending_posts) - 1)
    
    # Get the trending post at the specified index
    return trending_posts[index] if trending_posts else None


def list_all_trending_posts():
    trending_posts = []
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
                    # Skip the first trending post
                    if trending_counter > 1:
                        post_date_str = metadata_dict.get('date')
                        if post_date_str:
                            post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                            trending_post = {
                                "metadata": metadata_dict,
                                "content": markdown.markdown(content),
                                "date": post_date
                            }
                            trending_posts.append(trending_post)

    # Sort posts by date in descending order
    trending_posts.sort(key=lambda post: post['date'], reverse=True)

    # Remove <p> tags from the HTML content
    for post in trending_posts:
        post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', post["content"])

    return trending_posts

def get_latest_post():
    return list_trending_post(0)  # Get the latest trending post

def get_second_latest_post():
    return list_trending_post(1)  # Get the second latest trending post
