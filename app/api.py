from flask import Blueprint, request, session, jsonify

from .db import get_db, close_db

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/create-task', methods=['POST'])
def create_task():
  db = get_db()

  task = request.get_json()
  task_name = task.get('task')

  user_id = session.get('user_id')

  db_cursor = db.cursor()

  db_cursor.execute(
    'INSERT INTO tasks (task, user_id) VALUES (?, ?)',
    (task_name, user_id)
  )
  db.commit()

  task_id = db_cursor.lastrowid
  close_db()

  return jsonify({'task_id': task_id, 'task': task_name, 'completed': False})


@bp.route('/get-tasks', methods=['GET'])
def get_tasks():
  db = get_db()

  user_id = session.get('user_id')

  tasks = db.execute(
    'SELECT * FROM tasks WHERE user_id = ?',
    (user_id,)
  ).fetchall()

  close_db()

  task_list = [dict(task) for task in tasks]

  return jsonify({'user_tasks': task_list})
