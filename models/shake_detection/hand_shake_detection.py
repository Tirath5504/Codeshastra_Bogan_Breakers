import cv2
import time
import math as m
import mediapipe as mp

# Calculate distance
def findDistance(x1, y1, x2, y2):
    dist = m.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return dist

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

# Initialize frame counters
hand_shaking_duration = 0
start_shaking_time = None

# Initialize mediapipe hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

# Initialize webcam
cap = cv2.VideoCapture(0)

# ... (other initializations) ...

prev_wrist_x = 0
prev_wrist_y = 0
no_hand_detection_start_time = None

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
        if no_hand_detection_start_time is not None and time.time() - no_hand_detection_start_time >= 3:
            print("Hand not detected for 3 seconds. Closing window...")
            cv2.waitKey(1000)  # Wait for 1 second before closing
            break

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

        # Display the frame
        cv2.imshow('MediaPipe Hands', image)
        if cv2.waitKey(5) & 0xFF == ord('q'):
            break

    except:
        print("Hand not detected")
        break

cap.release()
cv2.destroyAllWindows()
