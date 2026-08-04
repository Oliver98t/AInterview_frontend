import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId:      import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
  secretAccessKey:  import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
  region:           "eu-west-2",
  service:          "execute-api",
});

const responseUrl = import.meta.env.VITE_RESPONSE_DEV_URL as string;

type SubmitType = "user" | "assistant";
// TODO update to use auth token
export async function sendResponse(user: string, message: string, role: SubmitType, clear: string, evaluate: boolean ) {
  const body = {
    user_name: user,
    message: message,
    role: role,
    clear_db: clear,
    eval: evaluate
  };
  const res = await aws.fetch(responseUrl, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Failed to send transcript");
  return res.json();
}
