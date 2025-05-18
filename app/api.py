from flask import Blueprint, request, session, jsonify
from .db import get_db, close_db

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/get-tasks', methods=['GET'])
def get_tasks():
  db = get_db()

  user_id = session.get('user_id')

  db_rows = db.execute(
    'SELECT * FROM tasks WHERE user_id = ?',
    (user_id,)
  ).fetchall()

  close_db()

  task_list = [{**dict(row), 'completed': bool(row['completed'])} for row in db_rows]

  return jsonify({'user_tasks': task_list})


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

  return jsonify({'task_id': task_id, 'task': task_name, 'completed': True})


@bp.route('/update-task/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
  db = get_db()

  task = request.get_json()
  task_completed = task.get('completed')

  db.execute(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    (task_completed, task_id)
  )
  db.commit()

  close_db()

  return jsonify({'task_id': task_id, 'completed': task_completed})


@bp.route('/edit-task/<int:task_id>', methods=['PATCH'])
def edit_task(task_id):
  db = get_db()

  task = request.get_json()
  task_text = task.get('task')

  db.execute(
    'UPDATE tasks SET task = ? WHERE id = ?',
    (task_text, task_id)
  )
  db.commit()

  close_db()
  
  return jsonify({'task_id': task_id, 'task': task_text})


@bp.route('delete-task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
  db = get_db()

  db.execute(
    'DELETE FROM tasks WHERE id = ?',
    (task_id,)
  )
  db.commit()

  close_db()

  return jsonify({'task_id': task_id})
