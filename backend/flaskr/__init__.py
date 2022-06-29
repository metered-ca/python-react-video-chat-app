import os
import requests

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Metered Secret Key
METERED_SECRET_KEY = os.environ.get("METERED_SECRET_KEY")
# Metered Domain
METERED_DOMAIN = os.environ.get("METERED_DOMAIN")


# API Route to create a meeting room
@app.route("/api/create/room", methods=['POST'])
def create_room():
    r = requests.post("https://"+METERED_DOMAIN + "/api/v1/room" +
                      "?secretKey="+METERED_SECRET_KEY)
    return r.json()


# API Route to validate meeting
@app.route("/api/validate-meeting")
def validate_meeting():
    roomName = request.args.get("roomName")
    if roomName:
        r = requests.get("https://" + METERED_DOMAIN + "/api/v1/room/" +
                         roomName + "?secretKey=" + METERED_SECRET_KEY)
        data = r.json()
        if (data.get("roomName")):
            return {"roomFound": True}
        else:
            return {"roomFound": False}
    else:
        return {
            "success": False,
            "message": "Please specify roomName"
        }


# API Route to fetch the Metered Domain
@app.route("/api/metered-domain")
def get_metered_domain():
    return {"METERED_DOMAIN": METERED_DOMAIN}


@app.route("/")
def index():
    return "Backend"
