from flask import Blueprint

from .auth import login_required

bp = Blueprint('main', __name__, static_folder='static', static_url_path='/static')

@bp.route('/')
@login_required
def index():
  return bp.send_static_file('pages/index.html')
