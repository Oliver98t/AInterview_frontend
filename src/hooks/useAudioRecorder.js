import { useState, useRef, useCallback } from "react";

/**
 * Hook that wraps the MediaRecorder API for in-browser audio recording.
 * Produces a Blob on stop and exposes recording state / timer.
 */
export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsedSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        // Release microphone
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(100); // collect data every 100 ms
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Microphone access denied. Please allow microphone permissions and try again."
          : `Could not start recording: ${err.message}`
      );
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    stopRecording();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsedSeconds(0);
    setError(null);
    chunksRef.current = [];
  }, [stopRecording, audioUrl]);

  /** Format elapsed seconds as MM:SS */
  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  return {
    isRecording,
    audioBlob,
    audioUrl,
    elapsedSeconds,
    formattedTime,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
