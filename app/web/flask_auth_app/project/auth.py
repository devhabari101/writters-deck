from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import login_user, login_required, logout_user, current_user, LoginManager
from .models import User
from . import db
import os
import re

auth_blueprint = Blueprint('auth', __name__)
login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('auth.login'))

# Configure file uploads
UPLOAD_FOLDER = 'static/admin-ui/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_blueprint.route('/login')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    return render_template('login.html')

@auth_blueprint.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))

    login_user(user, remember=remember)
    return redirect(url_for('main.index'))

@auth_blueprint.route('/signup')
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    return render_template('signup.html')

@auth_blueprint.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()

    if user:
        flash('Email address already exists')
        return redirect(url_for('auth.signup'))

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    new_user = User(email=email, name=name, password=hashed_password, avatar='avatar.jpg')

    db.session.add(new_user)
    db.session.commit()

    flash('You have successfully signed up!')
    return redirect(url_for('auth.login'))

@auth_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

# Directory containing Markdown files
markdown_dir = "content"

def list_user_markdowns():
    user_id = current_user.id
    user_markdowns = []

    for filename in os.listdir(markdown_dir):
        if filename.endswith(".md"):
            with open(os.path.join(markdown_dir, filename), "r", encoding="utf-8") as file:
                markdown_content = file.read()
            metadata_match = re.match(r'^---(.*?)---(.*)', markdown_content, re.DOTALL)
            if metadata_match:
                metadata, _ = metadata_match.groups()
                metadata_dict = {}
                for line in metadata.strip().split('\n'):
                    key_value = line.split(':', 1)
                    if len(key_value) == 2:
                        key, value = key_value
                        metadata_dict[key.strip()] = value.strip()
                if metadata_dict.get('user_id') == str(user_id):
                    user_markdowns.append(metadata_dict)
    
    return user_markdowns

@auth_blueprint.route("/admin", methods=["GET"])
@login_required
def dashboard():
    user_markdowns = list_user_markdowns()
    return render_template("admin/dashboard.html", name=current_user.name, email=current_user.email, user_markdowns=user_markdowns)

@auth_blueprint.route('/admin/profile/edit')
@login_required
def profile():
    return render_template("admin/profile_edit.html")

@auth_blueprint.route('/profile', methods=['POST'])
@login_required
def update_profile():
    action = request.form.get('action')
    
    if action == 'update_profile':
        current_user.first_name = request.form.get('first_name')
        current_user.last_name = request.form.get('last_name')
        current_user.phone_number = request.form.get('phone_number')
        current_user.location = request.form.get('location')
        current_user.institution = request.form.get('institution')
        current_user.role = request.form.get('role')
        current_user.address_line1 = request.form.get('address_line1')
        current_user.address_line2 = request.form.get('address_line2')
        current_user.zip_code = request.form.get('zip_code')
        current_user.bio = request.form.get('bio')
        
        db.session.commit()
        flash('Profile updated successfully', 'success')
    
    elif action == 'change_avatar':
        if 'avatar' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)
        
        file = request.files['avatar']
        
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            current_user.avatar = filename
            db.session.commit()
            flash('Avatar updated successfully', 'success')
        else:
            flash('Invalid file type', 'error')
    
    elif action == 'remove_avatar':
        current_user.avatar = None
        db.session.commit()
        flash('Avatar removed successfully', 'success')
    
    elif action == 'change_coverphoto':
        if 'coverphoto' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)
        
        file = request.files['coverphoto']
        
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            current_user.coverphoto = filename
            db.session.commit()
            flash('Cover photo updated successfully', 'success')
        else:
            flash('Invalid file type', 'error')
    
    return redirect(url_for('auth.profile'))
