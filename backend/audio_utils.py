import ffmpeg
import os

def extract_audio(video_path: str, out_wav_path: str):
    (
        ffmpeg
        .input(video_path)
        .output(out_wav_path, ac=1, ar="16000")
        .overwrite_output()
        .run(quiet=True)
    )
    return out_wav_path