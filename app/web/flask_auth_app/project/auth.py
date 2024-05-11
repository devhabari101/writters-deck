# auth.py

from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user, LoginManager
from .models import User
from . import db

auth_blueprint = Blueprint('auth', __name__)
login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    # Implement this function to load a user by ID
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    # Handle unauthorized access by redirecting users to the login page:
    return redirect(url_for('auth.login'))

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

    new_user = User(email=email, name=name, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    flash('You have successfully signed up!')
    return redirect(url_for('auth.login'))

@auth_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))
