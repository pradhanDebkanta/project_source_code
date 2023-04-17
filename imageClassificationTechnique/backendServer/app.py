from flask import Flask, request, jsonify
import keras.saving.legacy.save
import numpy as np
import cv2
import urllib.request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)


@app.get("/")
def index():
    return "server is running.."


# @cross_origin()
@app.post("/get_prediction")
def get_prediction():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        print("img_url==>", json["img_url"])

        resp = urllib.request.urlopen(json["img_url"])
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray_image, (200, 200),
                             interpolation=cv2.INTER_AREA)
        y = np.expand_dims(resized, axis=-1)
        y = np.expand_dims(y, axis=0)

        automl = keras.models.load_model(
            './final_model_CNN.h5')
       
        predictions = automl.predict(y).flatten()
        print('predicted result==>', predictions)
        if int(predictions[0]) == 1:
            print('Cyst')
            return jsonify(
                img_url=json["img_url"],
                img_type='Cyst',
            )
        elif int(predictions[1]) == 1:
            print('Normal')
            return jsonify(
                img_url=json["img_url"],
                img_type='Normal',
            )
        elif int(predictions[2]) == 1:
            print('Stone')
            return jsonify(
                img_url=json["img_url"],
                img_type='Stone',
            )
        elif int(predictions[3]) == 1:
            print('Tumor')
            return jsonify(
                img_url=json["img_url"],
                img_type='Tumor',
            )
        else:
            print('Not detected')
            return jsonify(
                img_url=json["img_url"],
                img_type='Not detected',
            )
    else:
        return jsonify(
            error='Content-Type not supported!',
        )
