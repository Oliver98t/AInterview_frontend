import { Button, Card, CardBody, Chip, Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "🎙️",
    title: "Voice Recording",
    description:
      "Record your spoken answers directly in the browser — no extra software needed.",
  },
  {
    icon: "🔤",
    title: "Speech-to-Text",
    description:
      "AWS Transcribe converts your speech to text with high accuracy in real-time.",
  },
  {
    icon: "🤖",
    title: "AI Feedback",
    description:
      "Amazon Bedrock (Nova Lite) analyses your answer and provides detailed, actionable feedback.",
  },
  {
    icon: "📊",
    title: "Track Progress",
    description:
      "Review your past responses and see how your interview skills improve over time.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose a Question",
    description: "Select a role or question category to begin your session.",
  },
  {
    number: "02",
    title: "Record Your Answer",
    description:
      "Hit record and answer as you would in a real interview. Take your time.",
  },
  {
    number: "03",
    title: "Get AI Analysis",
    description:
      "Your answer is transcribed and analysed by AI to surface key insights.",
  },
  {
    number: "04",
    title: "Review & Improve",
    description:
      "Read detailed feedback and iterate until your answer is interview-ready.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex mb-6">
          <Chip
            variant="flat"
            color="primary"
            size="sm"
            className="font-medium bg-primary/10 text-primary border border-primary/20 px-3"
            startContent={<span className="text-xs">✦</span>}
          >
            Powered by AWS Bedrock &amp; Amazon Transcribe
          </Chip>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-none">
          Ace your next
          <br />
          <span className="gradient-text">interview with AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-default-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Record spoken answers to interview questions and receive instant,
          detailed feedback powered by Amazon Bedrock. Practice at your own pace
          and build real confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            color="primary"
            variant="shadow"
            className="font-bold px-10 text-base glow-primary"
            onPress={() => navigate("/interview")}
          >
            Start Practising →
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="font-semibold px-10 text-base border-white/10 text-default-300 hover:bg-white/5"
            as={Link}
            href="/settings"
          >
            Configure API
          </Button>
        </div>

        {/* Hero visual */}
        <div className="mt-20 relative mx-auto max-w-3xl">
          <div className="card-glass rounded-2xl p-6 text-left shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
              </div>
              <span className="text-default-500 text-sm font-mono">
                interview-session.jsx
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 text-xs font-bold text-white">
                  AI
                </div>
                <div className="card-glass rounded-xl rounded-tl-none px-4 py-3 flex-1">
                  <p className="text-sm text-default-300">
                    <span className="text-primary font-semibold">
                      Question:
                    </span>{" "}
                    Tell me about a time you dealt with a difficult stakeholder.
                    How did you handle it?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-11">
                <div className="flex items-end gap-[3px] h-8 px-3 py-1.5 card-glass rounded-xl">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="sound-bar"
                      style={{ animationDelay: `${(i - 1) * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-danger text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse inline-block" />
                  Recording…
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0 text-xs font-bold text-success">
                  ✓
                </div>
                <div className="card-glass rounded-xl rounded-tl-none px-4 py-3 flex-1">
                  <p className="text-xs text-default-500 mb-1 font-semibold uppercase tracking-wider">
                    AI Feedback
                  </p>
                  <p className="text-sm text-default-300">
                    Strong use of the STAR method. Consider elaborating on the{" "}
                    <span className="text-primary">outcome</span> and quantifying
                    the impact to make your answer more compelling…
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under the card */}
          <div className="absolute inset-x-10 bottom-0 h-16 bg-primary/20 blur-3xl -z-10" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text">land the role</span>
          </h2>
          <p className="text-default-400 max-w-xl mx-auto">
            A complete interview practice loop built on AWS, from recording to
            AI-generated feedback.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Card
              key={f.title}
              className="card-glass border-white/[0.06] hover:border-primary/30 transition-colors group"
              shadow="none"
            >
              <CardBody className="p-6 gap-3">
                <div className="text-3xl mb-1">{f.icon}</div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-default-400 leading-relaxed">
                  {f.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-default-400 max-w-xl mx-auto">
            Four simple steps from question to confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {steps.map((step, idx) => (
            <div key={step.number} className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-primary">
                {step.number}
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-default-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 mb-10">
        <div className="card-glass rounded-3xl p-12 text-center border-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to practise?
            </h2>
            <p className="text-default-400 max-w-lg mx-auto mb-8">
              Start a session now. Don&apos;t forget to add your Lambda Function
              URLs in Settings before your first run.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                color="primary"
                variant="shadow"
                className="font-bold px-10 glow-primary"
                onPress={() => navigate("/interview")}
              >
                Start Interview
              </Button>
              <Button
                size="lg"
                variant="flat"
                color="primary"
                className="font-semibold px-10"
                onPress={() => navigate("/settings")}
              >
                Configure Settings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-default-500 text-sm">
          <p>
            AInterview Frontend ·{" "}
            <Link
              href="https://github.com/Oliver98t/AInterview_backend"
              isExternal
              className="text-primary/70 hover:text-primary text-sm"
            >
              View Backend on GitHub
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
