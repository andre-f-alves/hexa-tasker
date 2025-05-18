import functools

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from app.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['GET', 'POST'])
def register():
  if request.method == 'POST':
    username = request.form['username'].strip()
    password = request.form['password'].strip()

    db = get_db()
    error = None

    if not username:
      error = {'username': 'Nome de usuário não informado.'}
    
    elif not password:
      error = {'password': 'Senha não informada.'}

    if error is None:
      try:
        db.execute(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          (username, generate_password_hash(password))
        )
        db.commit()
      
      except db.IntegrityError:
        error = {'username': f'O nome de usuário "{username}" já existe.'}
      
      else:
        return redirect(url_for('auth.login'))
      
    return render_template('auth/register.html', error=error)
      
  return render_template('auth/register.html')


@bp.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    username = request.form['username'].strip()
    password = request.form['password'].strip()

    db = get_db()
    error = None

    if not username or not password:
      if not username:
        error = {'username': 'Nome de usuário não informado.'}

      if not password:
        error = {'password': 'Senha não informada.'}

    else:
      user = db.execute(
        'SELECT * FROM users WHERE username = ?',
        (username,)
      ).fetchone()

      if user is None:
        error = {'username': 'Usuário não encontrado.'}
      
      elif not check_password_hash(user['password'], password):
        error = {'password': 'Senha incorreta.'}
      
      if error is None:
        session.clear()
        session['user_id'] = user['id']

        return redirect(url_for('index'))
    
    return render_template('auth/login.html', error=error)
  
  return render_template('auth/login.html')


@bp.before_app_request
def load_logged_in_user():
  user_id = session.get('user_id')

  if user_id is None:
    g.user = None

  else:
    g.user = get_db().execute(
      'SELECT * FROM users WHERE id = ?',
      (user_id,)
    ).fetchone()


@bp.route('/logout')
def logout():
  session.clear()
  return redirect(url_for('index'))


def login_required(view):
  @functools.wraps(view)
  def wrapped_view(**kwargs):
    if g.user is None:
      return redirect(url_for('auth.login'))
    
    return view(**kwargs)
    
  return wrapped_view
