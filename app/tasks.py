from flask import Blueprint, flash, g, redirect, render_template, request, url_for
from werkzeug.exceptions import abort

from app.auth import login_required
from app.db import get_db

bp = Blueprint('tasks', __name__)

@bp.route('/')
@login_required
def index():
  db = get_db()

  tasks = db.execute(
    'SELECT tasks.id, task, completed, user_id'
    ' FROM tasks JOIN users ON tasks.user_id = users.id'
    ' ORDER BY completed ASC'
  ).fetchall()

  return render_template('tasks/index.html', tasks=tasks)
