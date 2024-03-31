import cv2
import mediapipe as mp

# Mediapipe drawing and pose estimation functions
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Define alert function (replace with your desired notification method)
def sound_alert():
  # Play a sound or send a notification
  print("Fall detected! Please check on the person.")

# Initialize video capture
cap = cv2.VideoCapture(0)

# Previous and current Y coordinates of the nose tip
prev_nose_y = 0
curr_nose_y = 0

# Threshold for fall detection (adjust based on your setup)
fall_threshold = 0.2  # pixels

while cap.isOpened():
  success, image = cap.read()

  # Convert image to RGB format (Mediapipe expects RGB)
  image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
  image.flags.writeable = False

  # Detect keypoints using Mediapipe Pose
  results = pose.process(image)

  # Draw pose landmarks on the image (optional for visualization)
  image.flags.writeable = True
  image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
  if results.pose_landmarks:
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

  # Extract y coordinate of the nose tip
  if results.pose_landmarks:
    curr_nose_y = results.pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE].y

  print(abs(curr_nose_y - prev_nose_y))
  # Check for significant change in Y-coordinate
  if abs(curr_nose_y - prev_nose_y) > fall_threshold:
    sound_alert()

  # Update previous nose Y-coordinate
  prev_nose_y = curr_nose_y

  # Display image with or without pose landmarks
  cv2.imshow('Fall Detection', image)

  # Exit on 'q' press
  if cv2.waitKey(5) & 0xFF == ord('q'):
    break

cap.release()
