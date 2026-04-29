# AInterview Frontend

A React frontend for the [AInterview Backend](https://github.com/Oliver98t/AInterview_backend) — an AI-powered mock interview tool built on AWS Bedrock and Amazon Transcribe.

## Tech Stack

- **React 18** + **Vite**
- **HeroUI** (formerly NextUI) — component library with dark theme
- **Tailwind CSS**
- **React Router v6**
- **Axios**

## Features

- 🎙 **In-browser audio recording** via the MediaRecorder API
- 🔤 **Speech-to-Text** — calls the `speech_to_text` Lambda and polls for results
- 🤖 **AI Feedback** — displays Bedrock-generated interview feedback
- ⚙️ **Settings page** — configure Lambda URLs stored in `localStorage`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Configuration

Before running an interview session, go to **Settings** (`/settings`) and enter:

| Setting | Description |
|---|---|
| Speech-to-Text Lambda URL | Lambda Function URL for the `speech_to_text` function |
| Get-Response Lambda URL | Lambda Function URL for the `get_response` function |
| S3 Presigned PUT URL | *(Optional)* Pre-signed S3 URL for uploading audio |
| AWS Region | Region where your backend is deployed (default: `eu-west-2`) |

### IAM Auth

Both Lambda Functions are deployed with `authorization_type = "AWS_IAM"`. For local development, set it to `"NONE"` in your Terraform config:

```hcl
resource "aws_lambda_function_url" "lambda_func_url" {
  authorization_type = "NONE"   # dev only
  ...
}
```

### S3 Audio Upload

The `speech_to_text` Lambda reads from `s3://<bucket>/uploads/<username>.flac`. Generate a presigned PUT URL with:

```bash
aws s3 presign s3://<bucket>/uploads/<username>.flac --expires-in 3600
```

> **Note:** Browser `MediaRecorder` outputs `audio/webm` not FLAC. For production, add a server-side conversion step.

## Project Structure

```
src/
├── components/
│   └── AppNavbar.jsx       # Navigation bar
├── hooks/
│   └── useAudioRecorder.js # MediaRecorder hook
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Interview.jsx       # Interview session (5-step flow)
│   └── Settings.jsx        # API configuration
├── services/
│   └── api.js              # API calls (S3 upload, transcription, polling)
├── App.jsx
├── main.jsx
└── index.css
```

## Interview Flow

1. **Enter username** — used to match `uploads/{username}.flac` in S3
2. **Select a question** — from a curated set of behavioural, technical & situational questions
3. **Record your answer** — browser microphone via MediaRecorder API
4. **Processing** — audio uploaded to S3 → `speech_to_text` Lambda → poll `get_response` Lambda
5. **Results** — view transcript and AI-generated feedback

## Building for Production

```bash
npm run build
```

Output is in `dist/`. Deploy to any static host (S3 + CloudFront, Netlify, Vercel, etc.).
