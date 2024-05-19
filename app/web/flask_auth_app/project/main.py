import json
import os
from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user
from .auth import auth_blueprint  # Import the auth blueprint

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    # Construct the file path relative to the application root
    json_file_path = '/web/flask_auth_app/markdown_output.json'
    
    # Read data from markdown_output.json
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
    
    # Filter the data to get the latest trending, topPick, and popular markdown
    latest_markdown = next((item for item in data if item['metadata'].get('trending') == 'on' and item['metadata'].get('topPick') == 'on' and item['metadata'].get('popular') == 'on'), None)
    
    # Pass data to the template for rendering
    return render_template('index.html', latest_markdown=latest_markdown)

@main_blueprint.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
