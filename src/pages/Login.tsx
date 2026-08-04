import { useAuth } from "react-oidc-context";

export default function Login() {
  const auth = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
      <div className="w-full max-w-md p-8 bg-[#1a1a2e] rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-2">AI Interview</h1>
        <p className="text-gray-400 mb-8">Practice your interview skills with AI</p>

        <button
          onClick={() => auth.signinRedirect()}
          className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
        >
          Sign In with Cognito
        </button>
      </div>
    </div>
  );
}
