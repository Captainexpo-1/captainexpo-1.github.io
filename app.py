from flask import Flask
from flask import request
from flask import send_from_directory
import os
import json
from dotenv import load_dotenv

app = Flask(__name__)

config = {}

@app.route('/')
def home():
    with open(config.get("visitors-file"), "r+") as f:
        visitors: dict = json.loads(f.read())
        print(request.environ)
        client_ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        visitors.setdefault(client_ip, 0)
        visitors[client_ip] += 1
        f.seek(0)
        f.write(json.dumps(visitors, indent=4))
        f.truncate()
    return send_from_directory('.', 'index.html')

@app.route('/other')
def other():
    return send_from_directory('public/other', 'index.html')

@app.route('/<path:filename>')
def serve_file(filename):
    public_dir = os.path.join(os.getcwd(), 'public')
    return send_from_directory(public_dir, filename)

if __name__ == '__main__':
    load_dotenv()
    PORT = os.getenv('PORT')
    CONFIG_FILE = os.getenv('CONFIG_FILE')
    
    config = json.loads(open(CONFIG_FILE, 'r').read())
    
    app.run(debug=True, port=PORT)
    