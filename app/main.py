from flask import Blueprint, Response, current_app

from .auth import login_required

bp = Blueprint('main', __name__, static_folder='static', static_url_path='/static')

@bp.route('/')
@login_required
def index():
  dev_env_active = current_app.config.get('DEBUG', False)

  if dev_env_active:
    with open('app/static/pages/index.html') as file:
      content = file.read()

    response = Response(content, mimetype='text/html')
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['Cache-Control'] = 'no-cache'

    return response
  
  else:
    return bp.send_static_file('pages/index.html')
