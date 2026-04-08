"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, StepForward, RotateCcw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type State = "idle" | "recording" | "review" | "uploading";

export default function Interview() {
  const params = useSearchParams();
  const router = useRouter();

  const role = params.get("role") || "Software Engineer";
  const mode = params.get("mode") || "Neutral";
  const difficulty = params.get("difficulty") || "Medium";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [state, setState] = useState<State>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const total = questions.length;
  // Start camera on mount
  useEffect(() => {
    const init = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        alert("Could not access camera or microphone.");
      }
    };
    init();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("interview_questions");

    if (stored) {
      setQuestions(JSON.parse(stored));
    } else {
      // fallback question
      setQuestions([
        "Tell me about yourself."
      ]);
    }
  }, []);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setPreviewUrl(url);
    };

    recorder.start();
    setRecordedBlob(null);
    setPreviewUrl(null);
    setState("recording");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setState("review");
    }
  };

  const retake = () => {
    setRecordedBlob(null);
    setPreviewUrl(null);
    setState("idle");
  };

  // Upload + analyze
  const finishInterview = async () => {
    if (!recordedBlob) {
      alert("No recording found!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    try {
      setState("uploading");

      // 1) Upload
      const form = new FormData();
      form.append("file", recordedBlob, "answer.webm");
      form.append("role", role);
      form.append("mode", mode);
      form.append("difficulty", difficulty);
      form.append("question", questions[questionIndex] || "");
      const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadRes.json();
      const interviewId = uploadData.interview_id;

      // 2) Analyze
      const analyzeRes = await fetch(`http://127.0.0.1:8000/analyze/${interviewId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!analyzeRes.ok) {
        throw new Error("Analyze failed");
      }

      // 3) Go to results page
      router.push(`/results?id=${interviewId}`);
    } catch (err) {
      console.error(err);
      alert("Upload or analysis failed");
      setState("review");
    }
  };

  const next = async () => {
  if (!recordedBlob) {
    alert("Please record your answer first");
    return;
  }

  try {
    setState("uploading");

    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("file", recordedBlob, "answer.webm");
    form.append("role", role);
    form.append("mode", mode);
    form.append("difficulty", difficulty);
    form.append("question", questions[questionIndex]);

    const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!uploadRes.ok) {
      throw new Error("Upload failed");
    }

    const data = await uploadRes.json();
    const interviewId = data.interview_id;

    const analyzeRes = await fetch(
      `http://127.0.0.1:8000/analyze/${interviewId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!analyzeRes.ok) {
      throw new Error("Analyze failed");
    }

    if (questionIndex + 1 >= total) {
      router.push("/reports");
    } else {
      setQuestionIndex((q) => q + 1);
      setRecordedBlob(null);
      setPreviewUrl(null);
      setState("idle");
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
    setState("review");
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
        <p>{questions[questionIndex] || "Loading question..."}</p>        <div className="mt-4 text-sm text-gray-400">
          {role} · {mode} · {difficulty}
        </div>
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
        {state === "review" && previewUrl && (
          <video src={previewUrl} controls className="w-full h-full object-cover" />
        )}

        {/* Overlay */}
        <div className="absolute top-4 left-4 text-sm text-gray-200 bg-black/50 px-3 py-1 rounded">
          {state === "recording"
            ? "Recording..."
            : state === "uploading"
              ? "Uploading..."
              : "Camera Preview"}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
          {state === "review" && (
            <button
              className="flex items-center gap-2 text-gray-300 hover:text-white"
              onClick={next}
            >
              Finish <StepForward size={18} />
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
              onClick={retake}
            >
              <RotateCcw size={18} /> Retake
            </button>
          )}
        </div>
      </div>

      {/* Right: Stats */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {state === "recording" ? "● REC" : state === "uploading" ? "..." : "00:00"}
          </div>
          <div className="text-sm text-gray-400">Current answer</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{questionIndex + 1}</div>
          <div className="text-sm text-gray-400">of {total}</div>
        </div>
      </div>
    </div>
  );
}