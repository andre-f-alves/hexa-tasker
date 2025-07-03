import os

from flask import Response, url_for
from app import create_app
from time import sleep

app = create_app()
  
@app.route('/reload')
def reload():
  files = list()

  with os.scandir('app/static') as entries:
    for entry in entries:
      if entry.is_dir():
        with os.scandir(entry.path) as sub_entries:
          for sub_entry in sub_entries:
            files.append(sub_entry.path)

  def stream(files):
    last_mods = {file: os.path.getmtime(file) for file in files}

    while True:
      for key, value in last_mods.items():
        current_mod = os.path.getmtime(key)

        if current_mod != value:
          last_mods[key] = current_mod
          yield 'data: reload\n\n'
      
      sleep(1)

  return Response(stream(files), mimetype='text/event-stream')


@app.after_request
def inject_sse_script(response):
  if response.content_type.startswith('text/html') and not response.direct_passthrough:
    sse_script = f'<script src="{url_for('static', filename='scripts/reloader.js')}"></script>'

    if response.get_data(as_text=True).find(sse_script) == -1:
      response.set_data(response.get_data(as_text=True).replace('</body>', f'{sse_script}</body>'))

    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    response.headers['Cache-Control'] = 'no-cache'

  return response


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=True)
