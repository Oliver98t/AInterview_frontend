import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Divider,
  Chip,
  Link,
} from "@heroui/react";

const SETTINGS_KEYS = {
  sttUrl: "ainterview_stt_url",
  getResponseUrl: "ainterview_get_response_url",
  s3PresignedUrl: "ainterview_s3_presigned_url",
  awsRegion: "ainterview_aws_region",
} as const;

interface QuickRefItem {
  label: string;
  cmd: string;
}

const quickRefItems: QuickRefItem[] = [
  {
    label: "Get Lambda URL (Terraform output)",
    cmd: "terraform output speech_to_text_function_url",
  },
  {
    label: "Generate S3 presigned URL",
    cmd: "aws s3 presign s3://<bucket>/uploads/<user>.flac --expires-in 3600",
  },
  {
    label: "Disable IAM auth (dev only)",
    cmd: 'authorization_type = "NONE"',
  },
  {
    label: "Run backend locally",
    cmd: "docker-compose up",
  },
];

export default function Settings() {
  const [sttUrl, setSttUrl] = useState("");
  const [getResponseUrl, setGetResponseUrl] = useState("");
  const [s3PresignedUrl, setS3PresignedUrl] = useState("");
  const [awsRegion, setAwsRegion] = useState("eu-west-2");
  const [saved, setSaved] = useState(false);

  // Load persisted settings on mount
  useEffect(() => {
    setSttUrl(localStorage.getItem(SETTINGS_KEYS.sttUrl) || "");
    setGetResponseUrl(
      localStorage.getItem(SETTINGS_KEYS.getResponseUrl) || ""
    );
    setS3PresignedUrl(
      localStorage.getItem(SETTINGS_KEYS.s3PresignedUrl) || ""
    );
    setAwsRegion(localStorage.getItem(SETTINGS_KEYS.awsRegion) || "eu-west-2");
  }, []);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEYS.sttUrl, sttUrl.trim());
    localStorage.setItem(SETTINGS_KEYS.getResponseUrl, getResponseUrl.trim());
    localStorage.setItem(SETTINGS_KEYS.s3PresignedUrl, s3PresignedUrl.trim());
    localStorage.setItem(SETTINGS_KEYS.awsRegion, awsRegion.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    Object.values(SETTINGS_KEYS).forEach((k) => localStorage.removeItem(k));
    setSttUrl("");
    setGetResponseUrl("");
    setS3PresignedUrl("");
    setAwsRegion("eu-west-2");
  };

  const inputClass = {
    inputWrapper:
      "border-white/10 hover:border-primary/50 focus-within:!border-primary bg-white/[0.03]",
  };

  const isConfigured =
    sttUrl.trim().length > 0 && getResponseUrl.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-default-400">
          Configure your AWS Lambda endpoints and S3 upload settings. All values
          are stored in your browser's localStorage — never sent to a third
          party.
        </p>
      </div>

      {/* Status banner */}
      <Card
        className={`mb-6 border ${
          isConfigured
            ? "border-success/30 bg-success/5"
            : "border-warning/30 bg-warning/5"
        }`}
        shadow="none"
      >
        <CardBody className="px-5 py-3 flex-row items-center gap-2">
          <span className="text-lg">{isConfigured ? "✅" : "⚠️"}</span>
          <p
            className={`text-sm font-medium ${
              isConfigured ? "text-success" : "text-warning"
            }`}
          >
            {isConfigured
              ? "Backend configured — you're ready to start interviewing."
              : "Lambda URLs not yet configured. Add them below to enable interview functionality."}
          </p>
        </CardBody>
      </Card>

      {/* Lambda URLs */}
      <Card className="card-glass border-white/[0.08] mb-5" shadow="none">
        <CardHeader className="px-6 pt-6 pb-2 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-base font-semibold">Lambda Function URLs</h2>
          </div>
          <p className="text-xs text-default-500">
            These are the AWS Lambda Function URLs for your deployed backend.
            Find them in the AWS Console under Lambda → Your Function →
            Configuration → Function URL.
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6 gap-5">
          <Input
            label="Speech-to-Text Lambda URL"
            placeholder="https://xxxxxxxxxxxx.lambda-url.eu-west-2.on.aws/"
            value={sttUrl}
            onValueChange={setSttUrl}
            variant="bordered"
            classNames={inputClass}
            description="Accepts GET with ?user={username}. Returns { jobId, transcription }."
            startContent={
              <span className="text-default-500 text-sm mr-1">🎙</span>
            }
          />
          <Input
            label="Get-Response Lambda URL"
            placeholder="https://xxxxxxxxxxxx.lambda-url.eu-west-2.on.aws/"
            value={getResponseUrl}
            onValueChange={setGetResponseUrl}
            variant="bordered"
            classNames={inputClass}
            description="Accepts GET with ?jobId={jobId}. Returns { response }."
            startContent={
              <span className="text-default-500 text-sm mr-1">🤖</span>
            }
          />

          <Card
            className="border border-primary/20 bg-primary/5 mt-1"
            shadow="none"
          >
            <CardBody className="px-4 py-3">
              <p className="text-xs text-default-400 leading-relaxed">
                <span className="text-primary font-semibold">⚠ IAM Auth:</span>{" "}
                Both Lambda Functions are deployed with{" "}
                <code className="text-primary/80">
                  authorization_type = "AWS_IAM"
                </code>
                . Browser requests will be rejected unless you change this to{" "}
                <code className="text-primary/80">"NONE"</code> in Terraform for
                development, or set up a Cognito Identity Pool for production
                SigV4 signing.
              </p>
            </CardBody>
          </Card>
        </CardBody>
      </Card>

      {/* S3 Upload */}
      <Card className="card-glass border-white/[0.08] mb-5" shadow="none">
        <CardHeader className="px-6 pt-6 pb-2 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪣</span>
            <h2 className="text-base font-semibold">S3 Audio Upload</h2>
          </div>
          <p className="text-xs text-default-500">
            The Speech-to-Text Lambda reads from{" "}
            <code className="text-default-400">
              s3://{"<bucket>"}/uploads/{"<username>"}.flac
            </code>
            . You need to upload your audio file to that path before calling the
            Lambda. Provide a presigned PUT URL below to enable browser-based
            upload.
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6 gap-5">
          <Input
            label="S3 Presigned PUT URL (optional)"
            placeholder="https://my-bucket.s3.eu-west-2.amazonaws.com/uploads/..."
            value={s3PresignedUrl}
            onValueChange={setS3PresignedUrl}
            variant="bordered"
            classNames={inputClass}
            description="Generate via: aws s3 presign s3://bucket/uploads/username.flac --expires-in 3600"
            startContent={
              <span className="text-default-500 text-sm mr-1">🔗</span>
            }
          />
          <Card
            className="border border-warning/20 bg-warning/5"
            shadow="none"
          >
            <CardBody className="px-4 py-3">
              <p className="text-xs text-default-400 leading-relaxed">
                <span className="text-warning font-semibold">Note:</span>{" "}
                Browser MediaRecorder outputs{" "}
                <code className="text-default-400">audio/webm</code> — not
                FLAC. For full compatibility, re-encode the audio server-side or
                use a dedicated upload endpoint that handles conversion.
              </p>
            </CardBody>
          </Card>
        </CardBody>
      </Card>

      {/* AWS Region */}
      <Card className="card-glass border-white/[0.08] mb-8" shadow="none">
        <CardHeader className="px-6 pt-6 pb-2 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <h2 className="text-base font-semibold">AWS Region</h2>
          </div>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <Input
            label="AWS Region"
            placeholder="eu-west-2"
            value={awsRegion}
            onValueChange={setAwsRegion}
            variant="bordered"
            classNames={inputClass}
            description="The AWS region where your resources are deployed."
          />
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          color="primary"
          variant="shadow"
          onPress={handleSave}
          className="flex-1 font-semibold glow-primary"
          size="lg"
          startContent={saved ? "✓" : undefined}
        >
          {saved ? "Saved!" : "Save Settings"}
        </Button>
        <Button
          variant="bordered"
          color="danger"
          className="flex-1 font-medium border-danger/20"
          onPress={handleClear}
          size="lg"
        >
          Clear All
        </Button>
      </div>

      <Divider className="my-8 bg-white/[0.06]" />

      {/* Help */}
      <div>
        <h3 className="text-sm font-semibold text-default-400 uppercase tracking-wider mb-4">
          Quick Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-default-500">
          {quickRefItems.map((item) => (
            <Card
              key={item.label}
              className="card-glass border-white/[0.04]"
              shadow="none"
            >
              <CardBody className="px-4 py-3 gap-1">
                <p className="text-default-500 text-xs">{item.label}</p>
                <code className="text-primary/70 text-xs break-all">
                  {item.cmd}
                </code>
              </CardBody>
            </Card>
          ))}
        </div>

        <p className="text-xs text-default-600 mt-6 text-center">
          Need help?{" "}
          <Link
            href="https://github.com/Oliver98t/AInterview_backend"
            isExternal
            className="text-primary/70 hover:text-primary text-xs"
          >
            View the backend repository →
          </Link>
        </p>

        <p className="text-xs text-default-600 mt-2 text-center">
          <Chip size="sm" variant="flat" color="default" className="text-xs">
            v0.1.0
          </Chip>
        </p>
      </div>
    </div>
  );
}
