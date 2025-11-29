# ml-service/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from src.models.breeding import run_breeding_pipeline

app = Flask(__name__)
CORS(app)  # allow frontend (e.g., http://localhost:3000) to call this API


@app.route("/api/breeding", methods=["POST"])
def breeding_endpoint():
    """
    Expects JSON in the body (the uploaded traits file content).
    Returns the breeding simulation result as JSON.
    """
    try:
        user_json = request.get_json() or {}
        result = run_breeding_pipeline(user_json=user_json)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    # Run Flask on port 5000
    app.run(host="0.0.0.0", port=5002, debug=True)
