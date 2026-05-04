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
const STEP_CONTEXT = 1;
const STEP_QUESTION = 2;


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
    setStep(STEP_CONTEXT);
  }, [username]);

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
              Enter login details
            </p>
          </CardHeader>
          <CardBody className="px-8 pb-8 gap-5">
            <Input
              placeholder="Username"
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

  // --- Step: set context of interview ---
  if (step === STEP_CONTEXT) {
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
          <p className="text-default-400">
            Describe the type of interview you want
          </p>

        <Card className="w-full max-w-md card-glass border-white/[0.08]" shadow="none">
          <CardHeader className="flex flex-col gap-2 px-8 pt-8 pb-2">

          </CardHeader>
          <CardBody className="px-8 pb-8 gap-5">
            <Input
              placeholder="Username"
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
      </div>
    );
  }

  return null;
}
