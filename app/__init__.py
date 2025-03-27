import os

from flask import Flask, render_template

def create_app():
  app = Flask(__name__, instance_relative_config=True)

  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  @app.route('/')
  def index():
    return render_template('index.html')

  return app
