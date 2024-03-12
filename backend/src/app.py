import os
import json
import datetime
import flask
from flask import Flask, render_template, request, send_from_directory, redirect
from flask_cors import CORS, cross_origin
import urllib
import requests
import google.auth.transport.requests
import google.oauth2.id_token
import pyrebase
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from env import FLASK_ENV
from constants import LASI_VM_SERVICE_URL, KEYPAIR_GENERATOR_URL, TOKEN_GENERATOR_URL


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "3600",
}


def check_token(f):
    @wraps(f)
    def wrap(*args,**kwargs):
        if not request.headers.get('Authorization'):
            return {'message': 'No token provided'},400
        try:
            user = auth.verify_id_token(request.headers['Authorization'].split(" ")[1])
            request.user = user
        except:
            return {'message':'Invalid token provided.'},400
        return f(*args, **kwargs)
    return wrap


def create_app(test_config=None):

    app = Flask(__name__, static_url_path="/static")
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app)

    #Connect to firebase
    cred = credentials.Certificate('fbAdminConfig.json')
    firebase = firebase_admin.initialize_app(cred)
    pb = pyrebase.initialize_app(json.load(open('fbconfig.json')))

    @app.route("/login")
    @app.route("/monitoring")
    @app.route("/")
    def get_index():
        
        response = send_from_directory("static", "index.html")
        # response.headers["Cache-Control"] = "no-store"
        return response


    return app
