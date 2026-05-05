import axios from "axios";

const responseUrl: string  = "https://oqan7u4aa6julpktfzyhe2ylpu0odoij.lambda-url.eu-west-2.on.aws/";

export async function sendTranscript(user: string, transcript: string) {
  const url = `${responseUrl}?user=${encodeURIComponent(user)}&transcript=${encodeURIComponent(transcript)}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to send transcript");
  return res.json();
}
