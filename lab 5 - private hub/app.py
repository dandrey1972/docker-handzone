from flask import Flask # pyright: ignore[reportMissingImports]
app = Flask(__name__)

@app.route('/health')
def health():
    return "ok"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
