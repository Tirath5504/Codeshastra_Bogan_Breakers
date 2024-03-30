
import streamlit as st
import numpy as np
import cv2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import MaxPooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.models import load_model
import os
import queue
from os import listdir
from os.path import isfile, join
import time
from collections import Counter
from streamlit_webrtc import (
    WebRtcMode,
    webrtc_streamer,
)
capture_duration = 20
start_time = time.time()


def emotion_find():

    webrtc_ctx = webrtc_streamer(
        key="loopback",
        mode=WebRtcMode.SENDONLY,
        # client_settings=WEBRTC_CLIENT_SETTINGS,
    )
    st.markdown("## Click here to activate me")
    if (st.button("Activate EMP")):
        progress = st.progress(0)
        i = 0
        while (int(time.time() - start_time) < capture_duration and i < 100):
            progress.progress(i+1)
            i = i+1
            # Find haar cascade to draw bounding box around face
            if webrtc_ctx.video_receiver:
                try:
                    video_frame = webrtc_ctx.video_receiver.get_frame(
                        timeout=10)
                    facecasc = cv2.CascadeClassifier(
                        'haarcascade_frontalface_default.xml')
                    gray = cv2.cvtColor(video_frame.to_ndarray(
                        format="bgr24"), cv2.COLOR_BGR2GRAY)
                    faces = facecasc.detectMultiScale(
                        gray, scaleFactor=1.3, minNeighbors=5)

                    for (x, y, w, h) in faces:
                        # cv2.rectangle(video_frame, (x, y-50), (x+w, y+h+10), (255, 0, 0), 2)
                        roi_gray = gray[y:y + h, x:x + w]
                        cropped_img = np.expand_dims(np.expand_dims(
                            cv2.resize(roi_gray, (48, 48)), -1), 0)
                        prediction = model.predict(cropped_img)
                        maxindex = int(np.argmax(prediction))
                        emo.append(emotion_dict[maxindex])
                except queue.Empty:
                    time.sleep(0.1)
                    continue
        if not emo:
            st.markdown("## Face Not Detected. Try Again")
        else:
            def most_frequent(List):
                occurence_count = Counter(List)
                return occurence_count.most_common(1)[0][0]
            user_emotion = most_frequent(emo)
            st.markdown("## You are "+user_emotion)
            songs = [f for f in listdir(
                "songs/"+user_emotion) if isfile(join("songs/"+user_emotion, f))]
            for song in songs:
                st.markdown(song)
                st.audio("songs/"+user_emotion+"/"+song)


st.title("Optima")
btn = st.button('start')
if btn:
    emotion_find()
