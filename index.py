from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Apna JWT yaha daalo
JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ODM4NTgzMzg4IiwianRpIjoiNjkzMGRhMjctOTBjNi00OTcyLTlkYjYtMjdhOTI2NzQxYjU5IiwiZXhwIjoxNzg1NDE1OTk0fQ.rZJMVGi-o-PmTH-GkpvOBowqrY_FflHVxRuW1-Ro27y2uNTiSwLXR0ohDoFXPcBdmwyyy70fjfUHU89By7_eVtpKZMH5hganj0PngE8r_ZxzvrmJApYlpKKjDP4SWPtNDLSFi30e9FOXUva1hihJxoGUUibTDAwX_vEM8fZQ_8E"

@app.route("/user-details")
def user_details():
    user_id = request.args.get("user")

    if not user_id:
        return jsonify({"success": False, "error": "Missing user ID"}), 400

    url = f"https://funstat.info/api/v1/users/{user_id}/stats_min"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {JWT}"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return jsonify({"success": False, "error": "Failed to fetch user info", "code": response.status_code}), 500
        
        data = response.json()
        return jsonify({"success": True, "data": data})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
