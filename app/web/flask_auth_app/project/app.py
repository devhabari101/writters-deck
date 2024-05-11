from flask import Flask
from main import main_blueprint
from auth import auth_blueprint
from convertor import convertor_blueprint

app = Flask(__name__)

# Register blueprints with the Flask application
app.register_blueprint(main_blueprint)
app.register_blueprint(auth_blueprint)
app.register_blueprint(convertor_blueprint)

# Other configuration and setup for your Flask application
