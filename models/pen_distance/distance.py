import cv2
import mediapipe as mp

# Initialize MediaPipe hands and drawing utils
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

# Initialize MediaPipe face mesh and drawing utils
mp_face_mesh = mp.solutions.face_mesh
face = mp_face_mesh.FaceMesh()

# for i in mp_face_mesh:
#     print(i)

# Define hand landmarks (fingers and palm) for distance calculation
hand_landmarks_for_distance = [mp_hands.HandLandmark.WRIST, mp_hands.HandLandmark.THUMB_TIP,
                               mp_hands.HandLandmark.INDEX_FINGER_TIP, mp_hands.HandLandmark.MIDDLE_FINGER_TIP,
                               mp_hands.HandLandmark.RING_FINGER_TIP, mp_hands.HandLandmark.PINKY_TIP]

# Define mouth landmark (center of upper lip) for distance calculation
mouth_landmark = mp_face_mesh.FACEMESH_LIPS

def calculate_distance(image, results_hands, results_face):
    """Calculates the distance between a hand landmark and the mouth landmark in pixels.

    Args:
        image: The input image frame.
        results_hands: The MediaPipe hand detection results.
        results_face: The MediaPipe face mesh detection results.

    Returns:
        The distance between the hand landmark and the mouth landmark in pixels, or None if no hand or face is detected.
    """

    if results_hands.multi_hand_landmarks and results_face.multi_face_landmarks:
        hand_landmarks = results_hands.multi_hand_landmarks[0].landmark
        face_landmarks = results_face.multi_face_landmarks[0].landmark

        # Access lip landmark coordinates directly (corrected access)
        lip_indices = list(mp_face_mesh.FACEMESH_LIPS)
        upper_lip_indices = [0, 1, 2, 3]
        lower_lip_indices = [6, 7, 8, 9]

        # Calculate average position of upper and lower lip landmarks
        upper_lip_x_sum = sum(landmark.x for landmark in (face_landmarks[i] for i in upper_lip_indices))
        upper_lip_y_sum = sum(landmark.y for landmark in (face_landmarks[i] for i in upper_lip_indices))
        upper_lip_center_x = upper_lip_x_sum / len(upper_lip_indices)
        upper_lip_center_y = upper_lip_y_sum / len(upper_lip_indices)

        lower_lip_x_sum = sum(landmark.x for landmark in (face_landmarks[i] for i in lower_lip_indices))
        lower_lip_y_sum = sum(landmark.y for landmark in (face_landmarks[i] for i in lower_lip_indices))
        lower_lip_center_x = lower_lip_x_sum / len(lower_lip_indices)
        lower_lip_center_y = lower_lip_y_sum / len(lower_lip_indices)

        # Calculate distance between hand landmark and lip center
        wrist_landmark = hand_landmarks[mp_hands.HandLandmark.WRIST]
        distance_x = abs(wrist_landmark.x * image.shape[1] - upper_lip_center_x * image.shape[1])  # Scale by image width
        distance_y = abs(wrist_landmark.y * image.shape[0] - upper_lip_center_y * image.shape[0])  # Scale by image height
        distance = (distance_x**2 + distance_y**2)**0.5 - 100  # Euclidean distance

        return abs(distance)
    else: 
        return None

# Capture video from webcam
cap = cv2.VideoCapture(0)

while True:
    success, image = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        # If loading a video file, you might break the loop here
        continue

    # Flip the image horizontally for a self-view display (optional)
    # image = cv2.flip(image, 1)

    # Convert the BGR image to RGB for MediaPipe hands
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Detect hands and faces in the image
    results_hands = hands.process(image_rgb)
    results_face = face.process(image_rgb)

    # Draw hand landmarks on the image (optional for visualization)
    if results_hands.multi_hand_landmarks:
        for hand_landmarks in results_hands.multi_hand_landmarks:
            mp_draw.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    # Display results (show only lips)
    if results_face.multi_face_landmarks:
        for face_landmarks in results_face.multi_face_landmarks:
            # Draw only lip landmarks on the image (corrected line)
            mp_draw.draw_landmarks(image, face_landmarks, mp_face_mesh.FACEMESH_LIPS, mp_draw.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1))

    # Calculate distance between hand and mouth (replace with mouth landmark calculation)
    distance = calculate_distance(image, results_hands, results_face)

    # Display distance information on the image (optional)
    if distance:
        cv2.putText(image, f"Distance (units): {int(distance)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 255, 0), 2)

    cv2.imshow('MediaPipe Hand Landmarks', image)

    # Exit loop on 'q' key press
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
