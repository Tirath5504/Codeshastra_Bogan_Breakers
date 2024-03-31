import cv2
import time
import math as m
import mediapipe as mp

# Calculate distance
def findDistance(x1, y1, x2, y2):
    dist = m.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return dist

# Calculate angle.
def findAngle(x1, y1, x2, y2):
    theta = m.acos((y2 - y1) * (-y1) / (m.sqrt(
        (x2 - x1) ** 2 + (y2 - y1) ** 2) * y1))
    degree = int(180 / m.pi) * theta
    return degree

# Function to check for hand shaking
def checkHandShaking(prev_wrist_x, prev_wrist_y, wrist_x, wrist_y):
    displacement = findDistance(prev_wrist_x, prev_wrist_y, wrist_x, wrist_y)
    if displacement > 3:
        return True
    else:
        return False  # Adjust threshold as needed

# Function to send alert when hand shaking detected
def sendWarning():
    print("Hand shaking detected!")

# Define alert function (replace with your desired notification method)
def sound_alert():
  # Play a sound or send a notification
  print("Fall detected! Please check on the person.")

# Initialize frame counters
good_frames = 0
bad_frames = 0
hand_shaking_duration = 0
start_shaking_time = None

# Font type.
font = cv2.FONT_HERSHEY_SIMPLEX

# Colors.
blue = (255, 127, 0)
red = (50, 50, 255)
green = (127, 255, 0)
dark_blue = (127, 20, 0)
light_green = (127, 233, 100)
yellow = (0, 255, 255)
pink = (255, 0, 255)

# Initialize mediapipe pose class.
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Initialize mediapipe hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

mp_drawing = mp.solutions.drawing_utils

# Initialize webcam
cap = cv2.VideoCapture(0)

# ... (other initializations) ...

prev_wrist_x = 0
prev_wrist_y = 0
no_hand_detection_start_time = None

# Threshold for fall detection (adjust based on your setup)
fall_threshold = 0.2 

while cap.isOpened():
    # Capture frames
    try:
        success, image = cap.read()
        if not success:
            print("Null Frames")
            break

        # Get height and width
        h, w = image.shape[:2]

        # Convert the BGR image to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        keypoints = pose.process(image)

        # ********HAND SHAKE DETECTION*******

        # Process the image for hand detection
        results = hands.process(image)

        # Convert the image back to BGR
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Check for detected hand and landmarks
        if not results.multi_hand_landmarks:
            # No hand detected, start timer if not already started
            if no_hand_detection_start_time is None:
                no_hand_detection_start_time = time.time()
        else:
            # Hand detected, reset timer
            no_hand_detection_start_time = None

        # Check for continuous no hand detection for 3 seconds
        # if no_hand_detection_start_time is not None and time.time() - no_hand_detection_start_time >= 3:
        #     print("Hand not detected for 3 seconds. Closing window...")
        #     cv2.waitKey(1000)  # Wait for 1 second before closing
        #     break

        # Check for detected hand and landmarks
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                wrist_x = int(hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x * w)
                wrist_y = int(hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].y * h)

                # Check for hand shaking
                is_shaking = checkHandShaking(prev_wrist_x, prev_wrist_y, wrist_x, wrist_y)

                if is_shaking:
                    # Start shaking timer if not already started
                    if start_shaking_time is None:
                        start_shaking_time = time.time()
                    hand_shaking_duration = time.time() - start_shaking_time

                else:
                    # Reset shaking timer and duration if hand is steady
                    start_shaking_time = None
                    hand_shaking_duration = 0

                # Draw circle on wrist landmark
                cv2.circle(image, (wrist_x, wrist_y), 7, (0, 0, 255), -1)

                # Display shaking info (modify as needed)
                if is_shaking:
                    shaking_text = f"Hand Shaking: {hand_shaking_duration:.2f} seconds"
                    cv2.putText(image, shaking_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

                # ... (other drawing/visualization code) ...

                prev_wrist_x = wrist_x
                prev_wrist_y = wrist_y

        # *********POSE DETECTION************

        # Use lm and lmPose as representative of the following methods.
        lm = keypoints.pose_landmarks
        lmPose = mp_pose.PoseLandmark

        # Acquire the landmark coordinates.
        # Once aligned properly, left or right should not be a concern.      
        # Left shoulder.
        l_shldr_x = int(lm.landmark[lmPose.LEFT_SHOULDER].x * w)
        l_shldr_y = int(lm.landmark[lmPose.LEFT_SHOULDER].y * h)
        # Right shoulder
        r_shldr_x = int(lm.landmark[lmPose.RIGHT_SHOULDER].x * w)
        r_shldr_y = int(lm.landmark[lmPose.RIGHT_SHOULDER].y * h)
        # Left ear.
        l_ear_x = int(lm.landmark[lmPose.LEFT_EAR].x * w)
        l_ear_y = int(lm.landmark[lmPose.LEFT_EAR].y * h)
        # Left hip.
        l_hip_x = int(lm.landmark[lmPose.LEFT_HIP].x * w)
        l_hip_y = int(lm.landmark[lmPose.LEFT_HIP].y * h)

        # Calculate distance between left shoulder and right shoulder points.
        offset = findDistance(l_shldr_x, l_shldr_y, r_shldr_x, r_shldr_y)

        # Calculate angles.
        neck_inclination = findAngle(l_shldr_x, l_shldr_y, l_ear_x, l_ear_y)
        torso_inclination = findAngle(l_hip_x, l_hip_y, l_shldr_x, l_shldr_y)

        # Draw landmarks.
        cv2.circle(image, (l_shldr_x, l_shldr_y), 7, yellow, -1)
        cv2.circle(image, (l_ear_x, l_ear_y), 7, yellow, -1)

        # Let's take y - coordinate of P3 100px above x1,  for display elegance.
        # Although we are taking y = 0 while calculating angle between P1,P2,P3.
        cv2.circle(image, (l_shldr_x, l_shldr_y - 100), 7, yellow, -1)
        cv2.circle(image, (r_shldr_x, r_shldr_y), 7, pink, -1)
        cv2.circle(image, (l_hip_x, l_hip_y), 7, yellow, -1)

        # Similarly, here we are taking y - coordinate 100px above x1. Note that
        # you can take any value for y, not necessarily 100 or 200 pixels.
        cv2.circle(image, (l_hip_x, l_hip_y - 100), 7, yellow, -1)

        # Put text, Posture and angle inclination.
        # Text string for display.
        angle_text_string = 'Neck : ' + str(int(neck_inclination)) + '  Torso : ' + str(int(torso_inclination))

        # Assist to align the camera to point at the side view of the person.
        # Offset threshold 30 is based on results obtained from analysis over 100 samples.
        if neck_inclination < 20 and torso_inclination < 10:
            cv2.putText(image, ' Aligned', (w - 200, 30), font, 0.9, green, 2)
        else:
            cv2.putText(image, ' Not Aligned', (w - 200, 30), font, 0.9, red, 2)

        # Determine whether good posture or bad posture.
        # The threshold angles have been set based on intuition.
        if neck_inclination < 20 and torso_inclination < 10:
            bad_frames = 0
            good_frames += 1

            # cv2.putText(image, angle_text_string, (10, 30), font, 0.9, light_green, 2)
            cv2.putText(image, str(int(neck_inclination)), (l_shldr_x + 10, l_shldr_y), font, 0.9, light_green, 2)
            cv2.putText(image, str(int(torso_inclination)), (l_hip_x + 10, l_hip_y), font, 0.9, light_green, 2)

            # Join landmarks.
            cv2.line(image, (l_shldr_x, l_shldr_y), (l_ear_x, l_ear_y), green, 4)
            cv2.line(image, (l_shldr_x, l_shldr_y), (l_shldr_x, l_shldr_y - 100), green, 4)
            cv2.line(image, (l_hip_x, l_hip_y), (l_shldr_x, l_shldr_y), green, 4)
            cv2.line(image, (l_hip_x, l_hip_y), (l_hip_x, l_hip_y - 100), green, 4)

        else:
            good_frames = 0
            bad_frames += 1

            # cv2.putText(image, angle_text_string, (10, 30), font, 0.9, red, 2)
            cv2.putText(image, str(int(neck_inclination)), (l_shldr_x + 10, l_shldr_y), font, 0.9, red, 2)
            cv2.putText(image, str(int(torso_inclination)), (l_hip_x + 10, l_hip_y), font, 0.9, red, 2)

            # Join landmarks.
            cv2.line(image, (l_shldr_x, l_shldr_y), (l_ear_x, l_ear_y), red, 4)
            cv2.line(image, (l_shldr_x, l_shldr_y), (l_shldr_x, l_shldr_y - 100), red, 4)
            cv2.line(image, (l_hip_x, l_hip_y), (l_shldr_x, l_shldr_y), red, 4)
            cv2.line(image, (l_hip_x, l_hip_y), (l_hip_x, l_hip_y - 100), red, 4)

        # # if answers.pose_landmarks:
        # #     mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # # Extract y coordinate of the nose tip
        # if results.pose_landmarks:
        #     curr_nose_y = results.pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE].y

        # # Check for significant change in Y-coordinate
        # if abs(curr_nose_y - prev_nose_y) > fall_threshold:
        #     sound_alert()

        # # Update previous nose Y-coordinate
        # prev_nose_y = curr_nose_y

        # Display the frame
        cv2.imshow('MediaPipe Hands', image)
        if cv2.waitKey(5) & 0xFF == ord('q'):
            break

    except:
        print("Hand not detected")
        cv2.waitKey(2000)
        break

cap.release()
cv2.destroyAllWindows()
