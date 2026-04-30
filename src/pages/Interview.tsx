import { useState, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Progress,
  Spinner,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ScrollShadow,
  Tooltip,
} from "@heroui/react";
import useAudioRecorder from "../hooks/useAudioRecorder";
import {
  uploadAudioToS3,
  startTranscription,
  pollForResponse,
} from "../services/api";

interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
}

type ChipColor =
  | "primary"
  | "secondary"
  | "warning"
  | "success"
  | "default"
  | "danger";

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    category: "Behavioural",
    question:
      "Tell me about a time you had to deal with a difficult stakeholder. How did you manage the situation?",
  },
  {
    id: 2,
    category: "Behavioural",
    question:
      "Describe a situation where you had to meet a tight deadline. What did you do?",
  },
  {
    id: 3,
    category: "Behavioural",
    question:
      "Give me an example of when you showed leadership, even without a formal leadership role.",
  },
  {
    id: 4,
    category: "Technical",
    question:
      "How do you approach debugging a production issue when you have limited information?",
  },
  {
    id: 5,
    category: "Technical",
    question:
      "Explain the trade-offs you would consider when choosing between a monolith and microservices architecture.",
  },
  {
    id: 6,
    category: "Situational",
    question:
      "If you joined a team mid-project and discovered the codebase had significant technical debt, what would you do?",
  },
  {
    id: 7,
    category: "Motivational",
    question:
      "Why do you want to work here, and what specifically excites you about this role?",
  },
  {
    id: 8,
    category: "General",
    question: "Where do you see yourself in five years?",
  },
];

const CATEGORY_COLORS: Record<string, ChipColor> = {
  Behavioural: "primary",
  Technical: "secondary",
  Situational: "warning",
  Motivational: "success",
  General: "default",
};

// Step indices
const STEP_USERNAME = 0;
const STEP_QUESTION = 1;
const STEP_RECORD = 2;
const STEP_PROCESSING = 3;
const STEP_RESULT = 4;

export default function Interview() {
  const [step, setStep] = useState(STEP_USERNAME);
  const [username, setUsername] = useState("");
  const [selectedQuestion, setSelectedQuestion] =
    useState<InterviewQuestion | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [transcription, setTranscription] = useState("");
  const [jobId, setJobId] = useState("");
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const { isOpen, onOpenChange } = useDisclosure();

  const {
    isRecording,
    audioBlob,
    audioUrl,
    formattedTime,
    error: recordingError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleUsernameSubmit = useCallback(() => {
    if (username.trim().length < 2) return;
    setStep(STEP_QUESTION);
  }, [username]);

  const handleSelectQuestion = useCallback(
    (q: InterviewQuestion) => {
      setSelectedQuestion(q);
      resetRecording();
      setAiResponse("");
      setTranscription("");
      setJobId("");
      setSubmitError("");
      setStep(STEP_RECORD);
    },
    [resetRecording]
  );

  const handleSubmitAnswer = useCallback(async () => {
    setSubmitError("");
    setStep(STEP_PROCESSING);
    setProcessingProgress(10);

    try {
      // Step 1: Upload audio to S3 (if presigned URL is configured)
      const presignedUrl =
        localStorage.getItem("ainterview_s3_presigned_url") || "";
      if (presignedUrl && audioBlob) {
        setProcessingStatus("Uploading audio to S3…");
        setProcessingProgress(20);
        await uploadAudioToS3(audioBlob, presignedUrl);
      }
      setProcessingProgress(35);

      // Step 2: Trigger speech-to-text
      setProcessingStatus("Transcribing your answer…");
      const { jobId: newJobId, transcription: newTranscription } =
        await startTranscription(username.trim());
      setJobId(newJobId);
      setTranscription(newTranscription);
      setProcessingProgress(65);

      // Step 3: Poll for AI response
      setProcessingStatus("Generating AI feedback…");
      const response = await pollForResponse(newJobId);
      setAiResponse(response);
      setProcessingProgress(100);

      setStep(STEP_RESULT);
    } catch (err) {
      setSubmitError((err as Error).message);
      setStep(STEP_RECORD);
    }
  }, [audioBlob, username]);

  const handleNewQuestion = useCallback(() => {
    resetRecording();
    setAiResponse("");
    setTranscription("");
    setJobId("");
    setSubmitError("");
    setStep(STEP_QUESTION);
  }, [resetRecording]);

  const handleRestart = useCallback(() => {
    resetRecording();
    setAiResponse("");
    setTranscription("");
    setJobId("");
    setSubmitError("");
    setUsername("");
    setSelectedQuestion(null);
    setStep(STEP_USERNAME);
  }, [resetRecording]);

  // --- Step: Username ---
  if (step === STEP_USERNAME) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
        </div>
        <Card className="w-full max-w-md card-glass border-white/[0.08]" shadow="none">
          <CardHeader className="flex flex-col gap-2 px-8 pt-8 pb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-2xl shadow-lg">
              🎯
            </div>
            <h1 className="text-2xl font-bold">Start your session</h1>
            <p className="text-default-400 text-sm text-center">
              Enter a username — this is used to match your audio file in S3.
            </p>
          </CardHeader>
          <CardBody className="px-8 pb-8 gap-5">
            <Input
              label="Username"
              placeholder="e.g. oliver"
              value={username}
              onValueChange={setUsername}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
              variant="bordered"
              classNames={{
                inputWrapper:
                  "border-white/10 hover:border-primary/50 focus-within:!border-primary bg-white/[0.03]",
              }}
              description="Your audio must be uploaded to S3 as uploads/{username}.flac before submitting."
              autoFocus
            />
            <Button
              color="primary"
              variant="shadow"
              onPress={handleUsernameSubmit}
              isDisabled={username.trim().length < 2}
              className="font-semibold w-full"
              size="lg"
            >
              Continue →
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // --- Step: Question Selection ---
  if (step === STEP_QUESTION) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Chip size="sm" variant="flat" color="primary" className="text-xs">
              {username}
            </Chip>
            <Button
              variant="light"
              size="sm"
              className="text-default-400 text-xs"
              onPress={handleRestart}
            >
              ← Change user
            </Button>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Choose a <span className="gradient-text">question</span>
          </h2>
          <p className="text-default-400">
            Select the question you want to practise answering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INTERVIEW_QUESTIONS.map((q) => (
            <Card
              key={q.id}
              isPressable
              onPress={() => handleSelectQuestion(q)}
              className="card-glass border-white/[0.06] hover:border-primary/40 transition-all group cursor-pointer"
              shadow="none"
            >
              <CardBody className="p-5 gap-3">
                <Chip
                  size="sm"
                  variant="flat"
                  color={CATEGORY_COLORS[q.category] ?? "default"}
                  className="w-fit text-xs font-medium"
                >
                  {q.category}
                </Chip>
                <p className="text-sm text-default-300 leading-relaxed group-hover:text-foreground transition-colors">
                  {q.question}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- Step: Record ---
  if (step === STEP_RECORD) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back button */}
        <Button
          variant="light"
          size="sm"
          className="text-default-400 mb-6"
          onPress={() => {
            resetRecording();
            setStep(STEP_QUESTION);
          }}
        >
          ← Back to questions
        </Button>

        {/* Question Card */}
        <Card className="card-glass border-white/[0.08] mb-6" shadow="none">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shrink-0">
                Q
              </div>
              <div>
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    CATEGORY_COLORS[selectedQuestion?.category ?? ""] ??
                    "default"
                  }
                  className="mb-2 text-xs"
                >
                  {selectedQuestion?.category}
                </Chip>
                <p className="text-default-200 leading-relaxed">
                  {selectedQuestion?.question}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recording Controls */}
        <Card className="card-glass border-white/[0.08] mb-4" shadow="none">
          <CardBody className="p-8 flex flex-col items-center gap-6">
            {/* Timer */}
            <div className="font-mono text-4xl font-bold tabular-nums text-default-300">
              {formattedTime}
            </div>

            {/* Sound visualiser / idle state */}
            <div className="flex items-end gap-[4px] h-10 min-w-[80px] justify-center">
              {isRecording ? (
                <>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="sound-bar"
                      style={{ animationDelay: `${(i - 1) * 0.1}s` }}
                    />
                  ))}
                </>
              ) : audioBlob ? (
                <span className="text-success text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success inline-block" />
                  Recording saved
                </span>
              ) : (
                <span className="text-default-500 text-sm">
                  Press record to start
                </span>
              )}
            </div>

            {/* Record / Stop button */}
            <div className="relative">
              {isRecording && (
                <>
                  <div className="pulse-ring" />
                  <div className="pulse-ring" style={{ animationDelay: "0.4s" }} />
                </>
              )}
              <Button
                isIconOnly
                size="lg"
                variant={isRecording ? "solid" : "bordered"}
                color={isRecording ? "danger" : "primary"}
                className={`w-16 h-16 rounded-full text-2xl transition-all ${
                  isRecording ? "glow-danger" : "border-white/20"
                }`}
                onPress={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? "⏹" : "🎙"}
              </Button>
            </div>

            <p className="text-xs text-default-500 text-center max-w-xs">
              {isRecording
                ? "Recording in progress… click to stop when you're done."
                : audioBlob
                ? "Recording complete. Play it back below or re-record."
                : "Click the microphone to begin recording your answer."}
            </p>
          </CardBody>
        </Card>

        {/* Playback */}
        {audioUrl && (
          <Card className="card-glass border-white/[0.06] mb-4" shadow="none">
            <CardBody className="px-6 py-4">
              <p className="text-xs text-default-500 mb-2 font-medium uppercase tracking-wider">
                Playback
              </p>
              <audio
                src={audioUrl}
                controls
                className="w-full h-10"
                style={{ accentColor: "#6366f1" }}
              />
            </CardBody>
          </Card>
        )}

        {/* Errors */}
        {(recordingError || submitError) && (
          <Card
            className="border border-danger/30 bg-danger/10 mb-4"
            shadow="none"
          >
            <CardBody className="px-5 py-3">
              <p className="text-danger text-sm">
                {recordingError || submitError}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {audioBlob && (
            <Button
              variant="flat"
              color="default"
              className="flex-1 font-medium border-white/10"
              onPress={resetRecording}
            >
              Re-record
            </Button>
          )}
          <Tooltip
            content={
              !audioBlob
                ? "Record an answer first"
                : "Transcribes your audio and generates AI feedback"
            }
          >
            <Button
              color="primary"
              variant="shadow"
              className="flex-1 font-semibold glow-primary"
              isDisabled={!audioBlob || isRecording}
              onPress={handleSubmitAnswer}
              size="lg"
            >
              Submit Answer →
            </Button>
          </Tooltip>
        </div>

        {/* Config warning if no URL set */}
        {!localStorage.getItem("ainterview_stt_url") && (
          <Card
            className="mt-4 border border-warning/30 bg-warning/5"
            shadow="none"
          >
            <CardBody className="px-5 py-3">
              <p className="text-warning text-xs">
                ⚠ No Lambda URLs configured.{" "}
                <a href="/settings" className="underline">
                  Go to Settings
                </a>{" "}
                to add your Speech-to-Text and Get-Response endpoint URLs.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  // --- Step: Processing ---
  if (step === STEP_PROCESSING) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Card className="card-glass border-white/[0.08]" shadow="none">
            <CardBody className="px-8 py-12 flex flex-col items-center gap-6">
              <Spinner
                size="lg"
                color="primary"
                classNames={{
                  circle1: "border-b-primary",
                  circle2: "border-b-primary/30",
                }}
              />
              <div>
                <h3 className="text-xl font-semibold mb-1">Processing…</h3>
                <p className="text-default-400 text-sm">{processingStatus}</p>
              </div>
              <Progress
                value={processingProgress}
                color="primary"
                className="w-full"
                classNames={{
                  indicator: "bg-gradient-to-r from-primary to-secondary",
                }}
              />
              <p className="text-xs text-default-500">
                This can take 20–60 seconds while AWS Transcribe processes your
                audio and Bedrock generates a response.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // --- Step: Result ---
  if (step === STEP_RESULT) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-xl">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Answer <span className="gradient-text">analysed</span>
            </h2>
            <p className="text-default-400 text-sm">
              Here's your AI feedback for Job ID:{" "}
              <code className="text-primary/80 text-xs">{jobId}</code>
            </p>
          </div>
        </div>

        {/* Question recap */}
        <Card className="card-glass border-white/[0.06] mb-5" shadow="none">
          <CardBody className="p-5">
            <p className="text-xs text-default-500 uppercase tracking-wider font-semibold mb-2">
              Question
            </p>
            <p className="text-default-300 text-sm leading-relaxed">
              {selectedQuestion?.question}
            </p>
          </CardBody>
        </Card>

        {/* Transcription */}
        {transcription && (
          <Card className="card-glass border-white/[0.06] mb-5" shadow="none">
            <CardBody className="p-5">
              <p className="text-xs text-default-500 uppercase tracking-wider font-semibold mb-2">
                Your Answer (Transcript)
              </p>
              <ScrollShadow className="max-h-32">
                <p className="text-default-300 text-sm leading-relaxed">
                  {transcription}
                </p>
              </ScrollShadow>
            </CardBody>
          </Card>
        )}

        <Divider className="my-5 bg-white/[0.06]" />

        {/* AI Response */}
        <Card
          className="border border-primary/20 bg-primary/5 mb-6"
          shadow="none"
        >
          <CardHeader className="px-6 pt-5 pb-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
              AI
            </div>
            <span className="text-sm font-semibold text-primary">
              AI Feedback
            </span>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-1">
            <ScrollShadow className="max-h-72">
              <p className="text-default-200 leading-relaxed whitespace-pre-wrap text-sm">
                {aiResponse}
              </p>
            </ScrollShadow>
          </CardBody>
        </Card>

        {/* Playback of recorded answer */}
        {audioUrl && (
          <Card className="card-glass border-white/[0.06] mb-6" shadow="none">
            <CardBody className="px-6 py-4">
              <p className="text-xs text-default-500 mb-2 font-medium uppercase tracking-wider">
                Your Recording
              </p>
              <audio src={audioUrl} controls className="w-full h-10" />
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            color="primary"
            variant="shadow"
            className="flex-1 font-semibold glow-primary"
            onPress={handleNewQuestion}
            size="lg"
          >
            Try Another Question
          </Button>
          <Button
            variant="bordered"
            className="flex-1 font-medium border-white/10 text-default-300"
            onPress={() => {
              resetRecording();
              setStep(STEP_RECORD);
            }}
            size="lg"
          >
            Re-attempt Same Question
          </Button>
        </div>

        {/* Hidden modal placeholder (useDisclosure kept for future use) */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Info</ModalHeader>
                <ModalBody />
                <ModalFooter>
                  <Button onPress={onClose}>Close</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }

  return null;
}
