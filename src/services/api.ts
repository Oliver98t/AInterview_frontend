import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId:      import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
  secretAccessKey:  import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  region:           "eu-west-2",
  service:          "lambda",
});

const responseUrl = import.meta.env.VITE_RESPONSE_DEV_URL as string;

type SubmitType = "user" | "assistant";

export async function sendResponse(user: string, message: string, role: SubmitType, clear: string, evaluate: boolean ) {
  const url = `${responseUrl}?user_name=${encodeURIComponent(user)}&message=${encodeURIComponent(message)}&role=${encodeURIComponent(role)}&clear_db=${encodeURIComponent(clear)}&eval=${encodeURIComponent(evaluate)}`;
  const res = await aws.fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to send transcript");
  return res.json();
}
