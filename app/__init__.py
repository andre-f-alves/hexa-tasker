import os

from flask import Flask

def create_app():
  app = Flask(__name__, instance_relative_config=True)

  app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'app.sqlite')
  )

  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  from . import db
  db.init_app(app)

  from . import auth
  app.register_blueprint(auth.bp)

  from . import api
  app.register_blueprint(api.bp)

  from . import main
  app.register_blueprint(main.bp)
  app.add_url_rule('/', endpoint='index')

  return app
