from flask import Flask, request, render_template, Response
import cv2

app = Flask(__name__)
camera = cv2.VideoCapture(0)


@app.route('/')
def index():
    return render_template('index.html')


def gen_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video')
def feed_video():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/get_url', methods=['POST'])
def get_url():
    if request.method == 'POST':
        print(request.form.video_url)
        return ''
    else:
        return 'error'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, use_reloader=False)
