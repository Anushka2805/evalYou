import ffmpeg
import os
import subprocess
import json

def extract_audio(video_path: str, out_wav_path: str):
    (
        ffmpeg
        .input(video_path)
        .output(out_wav_path, ac=1, ar="16000")
        .overwrite_output()
        .run(quiet=True)
    )
    return out_wav_path

def get_audio_duration_sec(path: str) -> float:
    # ffprobe via ffmpeg-python
    probe = ffmpeg.probe(path)
    streams = [s for s in probe["streams"] if s["codec_type"] == "audio"]
    if not streams:
        return 0.0
    return float(streams[0]["duration"])