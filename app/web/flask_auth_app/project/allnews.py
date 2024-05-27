import os
import re
import markdown
from datetime import datetime
from .convertor import markdown_dir  # Ensure the correct import path

def calculate_reading_time(word_count):
    words_per_minute = 200  # average reading speed
    reading_time = word_count / words_per_minute
    return max(1, round(reading_time))  # ensure at least 1 minute

def extract_metadata_and_content(markdown_content):
    metadata_match = re.match(r'^---(.*?)---(.*)', markdown_content, re.DOTALL)
    if metadata_match:
        metadata, content = metadata_match.groups()
        metadata_dict = {}
        for line in metadata.strip().split('\n'):
            key_value = line.split(':', 1)
            if len(key_value) == 2:
                key, value = key_value
                metadata_dict[key.strip()] = value.strip()
        return metadata_dict, content.strip()
    return None, None

def truncate_content(content, word_limit=47):
    words = content.split()
    truncated = ' '.join(words[:word_limit])
    return truncated

def process_markdown_file(filename):
    with open(os.path.join(markdown_dir, filename), "r", encoding="utf-8") as file:
        markdown_content = file.read()
    metadata_dict, content = extract_metadata_and_content(markdown_content)
    if metadata_dict:
        post_date_str = metadata_dict.get('date')
        if post_date_str:
            post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
            # Calculate word count and reading time
            word_count = len(content.split())
            reading_time = calculate_reading_time(word_count)
            # Add word count and reading time to metadata
            metadata_dict["word_count"] = word_count
            metadata_dict["reading_time"] = f"{reading_time} min read"
            # Add truncated content
            truncated_content = truncate_content(content)
            return {
                "metadata": metadata_dict,
                "content": markdown.markdown(content),
                "truncated_content": truncated_content,
                "date": post_date
            }
    return None

def list_all_posts():
    all_posts = []

    for filename in os.listdir(markdown_dir):
        if filename.endswith(".md"):
            post = process_markdown_file(filename)
            if post:
                all_posts.append(post)

    # Sort posts by date in descending order
    all_posts.sort(key=lambda post: post['date'], reverse=True)

    # Remove <p> tags from the HTML content
    for post in all_posts:
        post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', post["content"])
        post["truncated_content"] = re.sub(r'<p>(.*?)</p>', r'\1', post["truncated_content"])

    return all_posts

def get_post_by_index(index):
    all_posts = list_all_posts()
    if 0 <= index < len(all_posts):
        return all_posts[index]
    return None

def nget_latest_post():
    return get_post_by_index(0)

def nget_second_latest_post():
    return get_post_by_index(1)

def nget_fifth_latest_post():
    return get_post_by_index(3)