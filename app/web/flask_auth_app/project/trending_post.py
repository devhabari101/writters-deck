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
                if metadata_dict.get('trending') == 'on':
                    post_date_str = metadata_dict.get('date')
                    if post_date_str:
                        post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                        trending_post = {
                            "metadata": metadata_dict,
                            "content": markdown.markdown(content),
                            "date": post_date
                        }
                        trending_posts.append(trending_post)

    trending_posts.sort(key=lambda post: post['date'], reverse=True)

    if 0 <= index < len(trending_posts):
        trending_posts[index]["content"] = re.sub(r'<p>(.*?)</p>', r'\1', trending_posts[index]["content"])
        return trending_posts[index]
    else:
        return None

def list_all_trending_posts(skip_first=False):
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
                if metadata_dict.get('trending') == 'on':
                    post_date_str = metadata_dict.get('date')
                    if post_date_str:
                        post_date = datetime.strptime(post_date_str, '%d-%m-%Y')
                        trending_post = {
                            "metadata": metadata_dict,
                            "content": markdown.markdown(content),
                            "date": post_date
                        }
                        trending_posts.append(trending_post)

    trending_posts.sort(key=lambda post: post['date'], reverse=True)

    if skip_first and len(trending_posts) > 0:
        skipped_post = trending_posts[0]
        trending_posts = trending_posts[1:]
    else:
        skipped_post = None

    for post in trending_posts:
        post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', post["content"])

    return trending_posts, skipped_post

def get_latest_post():
    return list_trending_post(0)

def get_second_latest_post():
    return list_trending_post(1)

def get_skipped_trending_post():
    trending_posts, skipped_post = list_all_trending_posts(skip_first=True)
    if skipped_post:
        skipped_post["content"] = re.sub(r'<p>(.*?)</p>', r'\1', skipped_post["content"])
    return skipped_post

# In your main route file (e.g., main.py)
import os
import json
from flask import Blueprint, render_template
from flask_login import login_required, current_user
from .auth import auth_blueprint
from .features import get_filtered_data
from .trending_post import get_latest_post, get_second_latest_post, list_all_trending_posts, get_skipped_trending_post

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    
    try:
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        data = []
        
    filtered_data = get_filtered_data()
    
    latest_post = get_latest_post()
    second_latest_post = get_second_latest_post()
    trending_posts, skipped_post = list_all_trending_posts(skip_first=True)
    
    top_pick_count = 0
    popular_count = 0
    category_count = {}

    for item in data:
        if top_pick_count < 1 and item['metadata'].get('topPick') == 'on':
            filtered_data.append(item)
            top_pick_count += 1
        elif popular_count < 2 and item['metadata'].get('popular') == 'on':
            filtered_data.append(item)
            popular_count += 1
        category = item['metadata'].get('category')
        if category:
            category_count[category] = category_count.get(category, 0) + 1
    
    return render_template('index.html', post=latest_post, latest_post=latest_post, second_latest_post=second_latest_post, skipped_post=skipped_post, trending_posts=trending_posts, posts=filtered_data, category_count=category_count)

@main_blueprint.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
