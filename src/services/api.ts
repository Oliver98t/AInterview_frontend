import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId:      import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
  secretAccessKey:  import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  region:           "eu-west-2",
  service:          "lambda",
});

const responseUrl = import.meta.env.VITE_RESPONSE_DEV_URL as string;

export async function sendTranscript(user: string, transcript: string) {
  const url = `${responseUrl}?user=${encodeURIComponent(user)}&transcript=${encodeURIComponent(transcript)}`;
  const res = await aws.fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to send transcript");
  return res.json();
}
