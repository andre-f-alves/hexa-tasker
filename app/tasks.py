from flask import Blueprint, flash, g, redirect, render_template, request, url_for
from werkzeug.exceptions import abort

from app.auth import login_required
from app.db import get_db

bp = Blueprint('tasks', __name__)

@bp.route('/', methods=('GET', 'POST'))
@login_required
def index():
  db = get_db()

  if request.method == 'POST':
    task = request.form['task']
    create_task(db, task)

  tasks = db.execute(
    'SELECT tasks.id, task, completed, user_id'
    ' FROM tasks JOIN users ON tasks.user_id = users.id'
    ' ORDER BY completed ASC'
  ).fetchall()

  return render_template('tasks/index.html', tasks=tasks)


def create_task(db, task):
  db.execute(
    'INSERT INTO tasks (task, user_id) VALUES (?, ?)',
    (task, g.user['id'])
  )
  db.commit()
