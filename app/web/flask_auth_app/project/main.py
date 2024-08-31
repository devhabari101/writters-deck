import json
from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_required, current_user
from .auth import auth_blueprint  # Import the auth blueprint

main_blueprint = Blueprint('main', __name__)

# Function to get post data by slug
def get_post_by_slug(slug):
    with open('markdown_output.json', 'r', encoding='utf-8') as json_file:
        posts = json.load(json_file)
        # Loop through the posts to find the one with the matching slug
        for post in posts:
            if post['metadata'].get('slug') == slug:
                return post
    return None

@main_blueprint.route('/')
def index():
    return render_template('index.html')

@main_blueprint.route('/archive.html')
def archive():
    return render_template('archive.html')

@main_blueprint.route('/post-detail.html')
def post_detail():
    slug = request.args.get('slug')
    # Load the content associated with the slug
    post_data = get_post_by_slug(slug)  # Implement this function based on your data storage
    if post_data is None:
        return "Post not found", 404  # Handle case where post is not found
    return render_template('post-detail.html', post=post_data)

@main_blueprint.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
