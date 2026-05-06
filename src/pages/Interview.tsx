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
  user,
} from "@heroui/react";
import useAudioRecorder from "../hooks/useAudioRecorder";
import {
  sendTranscript
} from "../services/api";

// TODO create basic text question/answer section
// TODO implement feedback assessment (finishe interview button) 

const responseArr: string[] = [];

// Step indices
const STEP_USERNAME = 0;
const STEP_CONTEXT = 1;
const STEP_QUESTION = 2;

interface AIResponseProps {
  input: string
}

function AIResponse({input}: AIResponseProps) {
  return(
  <div className="flex justify-start">
    <div className="card-glass border-white/[0.06] hover:border-primary/30 transition-colors group bg-transparent rounded-2xl p-6 min-h-[80px] max-w-[90%] w-full">
      <span className="text-default-400 break-words">
        {input || "Your AI response will appear here."}
      </span>
    </div>
  </div>
  );
}

interface ReplyProps {
  initialValue?: string;
  onSubmit?: (value: string) => void;
}

function Reply({ initialValue = "", onSubmit }: ReplyProps) {
  const [value, setValue] = useState(initialValue);

  const handleInputChange = (val: string) => {
    setValue(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value);
    }
  };

  const handleButtonClick = () => {
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className="card-glass border-white/[0.06] hover:border-primary/30 transition-colors group bg-primary/20 rounded-2xl p-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <Input
          placeholder="Type your answer or notes here..."
          variant="flat"
          classNames={{
            inputWrapper:
              "bg-transparent border-none shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none active:outline-none active:ring-0 active:border-none active:shadow-none",
            input:
              "bg-transparent border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none active:outline-none active:ring-0 active:border-none active:shadow-none text-default-900",
          }}
          value={value}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus={false}
          className="flex-1"
        />
        <Button size="sm" onClick={handleButtonClick}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default function Interview() {
  const [step, setStep] = useState(STEP_CONTEXT);
  const [username, setUsername] = useState("");
  const [context, setContext] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  
  const handleUsernameSubmit = useCallback(() => {
    if (username.trim().length < 2) return;
    setStep(STEP_CONTEXT);
  }, [username]);

  const handleContextSubmit = useCallback(async () => {
    const prompt = `give a singular interview question for the following background (include just the question for an AI chat window): ${context}`
    const res = await sendTranscript("test", prompt)
    setAiResponse(res.response);
    responseArr.push(res.response);
    setStep(STEP_QUESTION);
  }, [context]);

  const handleRestart = useCallback(() => {
    setAiResponse("");
    setUsername("");
    setStep(STEP_USERNAME);
  }, []);

  // --- Step: Username ---
  if (step === STEP_USERNAME) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
        </div>
        <Card className="w-full max-w-md card-glass border-white/[0.06] hover:border-primary/30 transition-colors group bg-transparent rounded-2xl" shadow="none">
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
              variant="flat"
              classNames={{
                inputWrapper:
                  "border-none bg-transparent shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none active:outline-none active:ring-0 active:border-none active:shadow-none",
                input:
                  "bg-transparent border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none active:outline-none active:ring-0 active:border-none active:shadow-none",
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
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md mx-auto px-6 py-12">
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
                ← Log out
              </Button>
            </div>
            <p className="text-default-400 mb-4">
              Describe the type of interview you want
            </p>
            <div className="card-glass border-white/[0.06] hover:border-primary/30 transition-colors group bg-transparent rounded-2xl p-6">
              <Input
                placeholder="e.g. Frontend developer, system design, etc."
                value={context}
                onValueChange={setContext}
                onKeyDown={(e) => e.key === "Enter" && handleContextSubmit()}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "border-none bg-transparent shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:shadow-none active:outline-none active:ring-0 active:border-none active:shadow-none",
                  input:
                    "bg-transparent border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none active:outline-none active:ring-0 active:border-none active:shadow-none",
                }}
                autoFocus
              />
              <Button
                color="primary"
                variant="shadow"
                onPress={handleContextSubmit}
                className="font-semibold w-full"
                size="lg"
              >
                Continue →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Step: set context of interview ---
  if (step === STEP_QUESTION) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-2xl mx-auto px-6 py-12 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            
            

     
            
            <div className="flex justify-end">
              <div className="w-full max-w-[90%]">
                <Reply onSubmit={(val) => {console.log("Reply submitted:", val)
                    responseArr.push(val);
                    console.log(responseArr);
                }
                } />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  return null;
}
