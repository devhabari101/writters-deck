import json
from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_required, current_user
from .auth import auth_blueprint  # Import the auth blueprint

main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    return render_template('index.html')

@main_blueprint.route('/archive.html')
def archive():
    return render_template('archive.html')
    
@main_blueprint.route('/post-detail.html')
def post_detail():
    slug = request.args.get('slug')
    if not slug:
        return "Slug not provided", 400

    # Assuming you might want to pass the slug or other data to the template
    return render_template('post-detail.html', slug=slug)


@main_blueprint.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)
