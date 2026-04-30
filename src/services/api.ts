import axios from "axios";

interface Config {
  speechToTextUrl: string;
  getResponseUrl: string;
  s3PresignedUrl: string;
  awsRegion: string;
}

export interface TranscriptionResult {
  jobId: string;
  transcription: string;
}

export interface PollOptions {
  pollIntervalMs?: number;
  maxAttempts?: number;
}

/**
 * Retrieve settings from localStorage with fallbacks.
 */
function getConfig(): Config {
  return {
    speechToTextUrl: localStorage.getItem("ainterview_stt_url") || "",
    getResponseUrl: localStorage.getItem("ainterview_get_response_url") || "",
    s3PresignedUrl: localStorage.getItem("ainterview_s3_presigned_url") || "",
    awsRegion: localStorage.getItem("ainterview_aws_region") || "eu-west-2",
  };
}

/**
 * Upload audio blob to S3 using a presigned PUT URL.
 * The presigned URL must be generated externally (e.g. via AWS CLI or a
 * backend endpoint) and saved in Settings.
 */
export async function uploadAudioToS3(
  audioBlob: Blob,
  presignedUrl: string
): Promise<void> {
  if (!presignedUrl) {
    throw new Error(
      "No S3 presigned URL configured. Add one in Settings to enable audio upload."
    );
  }
  await axios.put(presignedUrl, audioBlob, {
    headers: { "Content-Type": audioBlob.type || "audio/webm" },
  });
}

/**
 * Call the speech_to_text Lambda Function URL.
 * Returns { jobId, transcription }.
 */
export async function startTranscription(
  username: string
): Promise<TranscriptionResult> {
  const { speechToTextUrl } = getConfig();
  if (!speechToTextUrl) {
    throw new Error(
      "Speech-to-Text Lambda URL not configured. Add it in Settings."
    );
  }
  const response = await axios.get<TranscriptionResult>(speechToTextUrl, {
    params: { user: username },
    timeout: 120_000,
  });
  return response.data;
}

/**
 * Poll the get_response Lambda Function URL until a response is available.
 * Returns the AI response string.
 */
export async function pollForResponse(
  jobId: string,
  { pollIntervalMs = 3000, maxAttempts = 20 }: PollOptions = {}
): Promise<string> {
  const { getResponseUrl } = getConfig();
  if (!getResponseUrl) {
    throw new Error(
      "Get-Response Lambda URL not configured. Add it in Settings."
    );
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise<void>((r) => setTimeout(r, pollIntervalMs));
    try {
      const resp = await axios.get<{ response?: string }>(getResponseUrl, {
        params: { jobId },
        timeout: 15_000,
      });
      if (resp.data?.response) {
        return resp.data.response;
      }
    } catch {
      // Item may not be in DynamoDB yet — keep polling
    }
  }
  throw new Error(
    "Timed out waiting for AI response. The backend may still be processing."
  );
}
