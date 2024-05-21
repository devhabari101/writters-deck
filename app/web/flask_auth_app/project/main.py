import os
import json
from flask import Blueprint, render_template
from flask_login import login_required, current_user
from .auth import auth_blueprint  # Import the auth blueprint
from .features import get_filtered_data  # Import the get_filtered_data function
from .trending_post import get_latest_post, get_second_latest_post  # Import the functions
main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    # Construct the file path relative to the application root
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    
    # Read data from markdown_output.json
    try:
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        # Handle the case where the file doesn't exist
        data = []
        
    # Get the filtered data
    filtered_data = get_filtered_data()
    
    # Get the latest and second latest posts
    latest_post = get_latest_post()
    second_latest_post = get_second_latest_post()
    
    # Filter data for entries where topPick or popular is "on"
    filtered_data = []
    top_pick_count = 0
    popular_count = 0
    category_count = {}

    if latest_post:
        filtered_data.append(latest_post)

    if second_latest_post:
        filtered_data.append(second_latest_post)

    for item in data:
        if top_pick_count < 1 and item['metadata'].get('topPick') == 'on':
            filtered_data.append(item)
            top_pick_count += 1
        elif popular_count < 2 and item['metadata'].get('popular') == 'on':
            filtered_data.append(item)
            popular_count += 1
        # Update category count
        category = item['metadata'].get('category')
        if category:
            category_count[category] = category_count.get(category, 0) + 1
    
    # Pass the filtered data and category count to the template for rendering
    return render_template('index.html', data=filtered_data, latest_post=latest_post, second_latest_post=second_latest_post, posts=filtered_data, category_count=category_count)


@main_blueprint.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
