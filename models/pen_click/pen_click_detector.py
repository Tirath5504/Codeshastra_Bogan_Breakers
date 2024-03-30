import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

# Define constants
CAMERA_ID = 0
THUMB_TIP_INDEX = 4  # Index of thumb tip landmark
THUMB_IP_PROXIMAL_INDEX = 1  # Index of proximal phalanx landmark (replace based on documentation)
THUMB_IP_DISTAL_INDEX = 2  # Index of distal phalanx landmark (replace based on documentation)
WRIST_LANDMARK_INDEX = 0  # Index of wrist landmark (reference point)
PINKY_TIP_INDEX = 19  # Index of pinky tip landmark (reference point)
MOVEMENT_THRESHOLD = 20  # Threshold for movement distance
ANGLE_THRESHOLD = 45  # Threshold for direction deviation (degrees)
IP_MOVEMENT_THRESHOLD = 10  # Threshold for IP joint movement

# Initialize variables for tracking
prev_thumb_tip_x = None
prev_thumb_tip_y = None
prev_palm_center_x = None
prev_palm_center_y = None
movement_detected = False  # Flag to indicate significant movement

# Define camera source (default is webcam)
cap = cv2.VideoCapture(CAMERA_ID)

# Initialize hand landmark model (set static_image_mode=False for video)
with mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
  while cap.isOpened():
    success, frame = cap.read()

    if not success:
      print("Ignoring empty camera frame.")
      continue

    # Convert frame to RGB for MediaPipe
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame with hand landmark model
    results = hands.process(frame_rgb)

    # Draw hand landmarks on the frame (if detected)
    if results.multi_hand_landmarks:
      for hand_landmarks in results.multi_hand_landmarks:
        mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        # Get thumb tip and reference point positions
        thumb_tip = hand_landmarks.landmark[THUMB_TIP_INDEX]
        thumb_tip_x = int(thumb_tip.x * frame.shape[1])
        thumb_tip_y = int(thumb_tip.y * frame.shape[0])
        wrist = hand_landmarks.landmark[WRIST_LANDMARK_INDEX]
        pinky_tip = hand_landmarks.landmark[PINKY_TIP_INDEX]
        palm_center_x = int((wrist.x + pinky_tip.x) / 2 * frame.shape[1])
        palm_center_y = int((wrist.y + pinky_tip.y) / 2 * frame.shape[0])

        # Track movement (optional)
        if prev_thumb_tip_x and prev_thumb_tip_y and prev_palm_center_x and prev_palm_center_y:
          # Calculate relative movement
          relative_movement_x = thumb_tip_x - prev_palm_center_x
          relative_movement_y = thumb_tip_y - prev_palm_center_y
          movement_distance = abs(relative_movement_x) + abs(relative_movement_y)

          # Calculate displacement vectors
          thumb_displacement_x = thumb_tip_x - prev_thumb_tip_x
          thumb_displacement_y = thumb_tip_y - prev_thumb_tip_y
          palm_displacement_x = palm_center_x - prev_palm_center_x
          palm_displacement_y = palm_center_y - prev_palm_center_y

          # Calculate movement angle
          movement_angle = abs(
              np.arctan2(thumb_displacement_y, thumb_displacement_x) -
              np.arctan2(palm_displacement_y, palm_displacement_x)
          ) * 180 / np.pi

          # Calculate IP joint movement
          ip_displacement_x = hand_landmarks.landmark[THUMB_IP_PROXIMAL_INDEX].x - hand_landmarks.landmark[THUMB_IP_DISTAL_INDEX].x
          ip_displacement_y = hand_landmarks.landmark[THUMB_IP_PROXIMAL_INDEX].y - hand_landmarks.landmark[THUMB_IP_DISTAL_INDEX].y
          ip_movement_distance = abs(ip_displacement_x) + abs(ip_displacement_y)

          # Refine movement detection logic
          if ip_movement_distance > IP_MOVEMENT_THRESHOLD and (movement_distance > MOVEMENT_THRESHOLD and movement_angle > ANGLE_THRESHOLD):
            movement_detected = True
            print("Thumb movement detected!")  # Or perform other actions

            # Additional functionalities based on movement detection (optional)
            # Example: Draw a circle around the thumb tip
            cv2.circle(frame, (thumb_tip_x, thumb_tip_y), 5, (0, 255, 0), -1)

          # Update previous positions for next frame
          prev_thumb_tip_x = thumb_tip_x
          prev_thumb_tip_y = thumb_tip_y
          prev_palm_center_x = palm_center_x
          prev_palm_center_y = palm_center_y

    # Display movement status if detected
    if movement_detected:
        movement_direction = ""
        if relative_movement_x > 0:
            movement_direction = " (Right)"
        elif relative_movement_x < 0:
            movement_direction = " (Left)"
        text = f"Thumb Movement Detected{movement_direction}"
        cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 0, 255), 2)

        # Visualize thumb tip with a circle (optional)
        cv2.circle(frame, (thumb_tip_x, thumb_tip_y), 5, (0, 255, 0), -1)

        # Reset flag after displaying message
        movement_detected = False  # Reset flag to avoid continuous printing


    # Display the processed frame
    cv2.imshow('MediaPipe Hands - Thumb Tracking', frame)

    # Exit loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break

# Release resources
cap.release()
cv2.destroyAllWindows()
