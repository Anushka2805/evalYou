import cv2
import mediapipe as mp

mp_face = mp.solutions.face_mesh

def analyze_body(video_path: str):
    cap = cv2.VideoCapture(video_path)

    face_mesh = mp_face.FaceMesh(static_image_mode=False, max_num_faces=1)

    total_frames = 0
    eye_contact_frames = 0
    movement = 0

    prev_nose = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        total_frames += 1

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:
            face = results.multi_face_landmarks[0]

            # Nose tip landmark (index 1)
            h, w, _ = frame.shape
            nose = face.landmark[1]
            nose_px = (int(nose.x * w), int(nose.y * h))

            # Eye contact heuristic: face detected = looking at camera (simple proxy)
            eye_contact_frames += 1

            if prev_nose is not None:
                movement += abs(nose_px[0] - prev_nose[0]) + abs(nose_px[1] - prev_nose[1])

            prev_nose = nose_px

    cap.release()

    if total_frames == 0:
        return {"eye_contact_pct": 0, "head_movement": 0, "engagement": 0}

    eye_contact_pct = int((eye_contact_frames / total_frames) * 100)

    # Normalize movement to a rough score
    head_movement = int(min(100, movement / max(1, total_frames)))

    # Engagement = mix of eye contact & stability
    engagement = int(0.7 * eye_contact_pct + 0.3 * max(0, 100 - head_movement))

    return {
        "eye_contact_pct": eye_contact_pct,
        "head_movement": head_movement,
        "engagement": engagement,
    }