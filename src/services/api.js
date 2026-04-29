import axios from "axios";

/**
 * Retrieve settings from localStorage with fallbacks.
 */
function getConfig() {
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
 *
 * @param {Blob} audioBlob  The recorded audio blob
 * @param {string} presignedUrl  Pre-generated S3 presigned PUT URL
 */
export async function uploadAudioToS3(audioBlob, presignedUrl) {
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
 *
 * Note: Lambda Function URLs are configured with authorization_type = "AWS_IAM".
 * For local testing / demo purposes you may temporarily set
 * authorization_type = "NONE" in your Terraform config.
 *
 * @param {string} username
 */
export async function startTranscription(username) {
  const { speechToTextUrl } = getConfig();
  if (!speechToTextUrl) {
    throw new Error(
      "Speech-to-Text Lambda URL not configured. Add it in Settings."
    );
  }
  const response = await axios.get(speechToTextUrl, {
    params: { user: username },
    timeout: 120_000, // transcription can take a while
  });
  return response.data; // { jobId, transcription }
}

/**
 * Poll the get_response Lambda Function URL until a response is available.
 * Returns the AI response string.
 *
 * @param {string} jobId
 * @param {object} options
 * @param {number} [options.pollIntervalMs=3000]
 * @param {number} [options.maxAttempts=20]
 */
export async function pollForResponse(
  jobId,
  { pollIntervalMs = 3000, maxAttempts = 20 } = {}
) {
  const { getResponseUrl } = getConfig();
  if (!getResponseUrl) {
    throw new Error(
      "Get-Response Lambda URL not configured. Add it in Settings."
    );
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, pollIntervalMs));
    try {
      const resp = await axios.get(getResponseUrl, {
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
