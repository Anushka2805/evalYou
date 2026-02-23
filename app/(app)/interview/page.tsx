"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, StepForward, RotateCcw, Play } from "lucide-react";

type State = "idle" | "recording" | "review";

export default function Interview() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [state, setState] = useState<State>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const total = 7;

  // Start camera on mount
  useEffect(() => {
    const init = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
        alert("Could not access camera or microphone.");
      }
    };

    init();

    return () => {
      // cleanup on unmount
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
    };

    recorder.start();
    setRecordedUrl(null);
    setState("recording");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setState("review");
    }
  };

  const retake = () => {
    setRecordedUrl(null);
    setState("idle");
  };

  const next = () => {
    if (questionIndex + 1 >= total) {
      window.location.href = "/analyzing";
    } else {
      setQuestionIndex((q) => q + 1);
      setRecordedUrl(null);
      setState("idle");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left: Question */}
      <div className="col-span-4 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-sm text-gray-400 mb-2">
          Question {questionIndex + 1} of {total}
        </div>
        <div className="w-full h-2 bg-white/10 rounded mb-4">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
          />
        </div>
        <p>
          Can you explain the concept of object-oriented programming and how it
          differs from procedural programming?
        </p>
        <div className="mt-4 text-sm text-gray-400">Mode: Neutral</div>
      </div>

      {/* Center: Video */}
      <div className="col-span-6 bg-black border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
        {/* Live preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${state === "review" ? "hidden" : "block"}`}
        />

        {/* Playback preview */}
        {state === "review" && recordedUrl && (
          <video
            src={recordedUrl}
            controls
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay text */}
        <div className="absolute top-4 left-4 text-sm text-gray-200 bg-black/50 px-3 py-1 rounded">
          {state === "recording" ? "Recording..." : "Camera Preview"}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
          {state === "review" && (
            <button
              className="flex items-center gap-2 text-gray-300 hover:text-white"
              onClick={retake}
            >
              <RotateCcw size={18} /> Retake
            </button>
          )}

          {state === "idle" && (
            <button
              className="bg-blue-600 p-4 rounded-full hover:bg-blue-500 transition"
              onClick={startRecording}
            >
              <Mic />
            </button>
          )}

          {state === "recording" && (
            <button
              className="bg-red-600 p-4 rounded-full hover:bg-red-500 transition"
              onClick={stopRecording}
            >
              <Square />
            </button>
          )}

          {state === "review" && (
            <button
              className="flex items-center gap-2 text-gray-300 hover:text-white"
              onClick={next}
            >
              Next <StepForward size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Stats */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {state === "recording" ? "● REC" : "00:00"}
          </div>
          <div className="text-sm text-gray-400">Current answer</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{questionIndex + 1}</div>
          <div className="text-sm text-gray-400">of {total}</div>
        </div>
        <a
          href="/analyzing"
          className="block text-center bg-blue-600 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          Save & Exit
        </a>
      </div>
    </div>
  );
}