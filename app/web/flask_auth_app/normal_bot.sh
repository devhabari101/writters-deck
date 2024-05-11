#!/bin/bash
python3 -m venv venv
source venv/bin/activate
pip3 install -U pip
pip install -r requirements.txt
export FLASK_APP=project
export FLASK_DEBUG=1
flask run --host=0.0.0.0 --port=7000

