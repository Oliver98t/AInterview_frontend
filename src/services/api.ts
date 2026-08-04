const responseUrl = import.meta.env.VITE_RESPONSE_DEV_URL as string;

type SubmitType = "user" | "assistant";
export async function sendResponse(
  user: string, 
  message: string, 
  role: SubmitType, 
  clear: string, 
  evaluate: boolean,
  accessToken: string ) {
    
  const body = {
    user_name: user,
    message: message,
    role: role,
    clear_db: clear,
    eval: evaluate
  };
  const res = await fetch(responseUrl, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to send transcript: ${res.status} ${text}`);
  }
  return res.json();
}
