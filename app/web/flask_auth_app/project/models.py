from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)  # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    location = db.Column(db.String(100))
    institution = db.Column(db.String(100))
    role = db.Column(db.String(100))
    address_line1 = db.Column(db.String(200))
    address_line2 = db.Column(db.String(200))
    zip_code = db.Column(db.String(20))
    avatar = db.Column(db.String(200), default='avatar.png')  # Default avatar
    coverphoto = db.Column(db.String(200))
    bio = db.Column(db.Text)  # Add bio field
