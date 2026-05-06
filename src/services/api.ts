import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId: "",//import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: "",//import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2",
  service: "lambda", // or "execute-api" for API Gateway
});

const responseUrl: string = "https://oqan7u4aa6julpktfzyhe2ylpu0odoij.lambda-url.eu-west-2.on.aws/";

export async function sendTranscript(user: string, transcript: string) {
  const url = `${responseUrl}?user=${encodeURIComponent(user)}&transcript=${encodeURIComponent(transcript)}`;
  const res = await aws.fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to send transcript");
  return res.json();
}
