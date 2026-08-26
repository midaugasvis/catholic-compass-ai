# Catholic Compass AI — GitHub-ready Alpha

This package is prepared for GitHub and browser hosting.

## Recommended setup

GitHub stores the source. Use Vercel, Render, or Railway to run it as a browser app.

### Server secrets

Configure these on the hosting platform, never in GitHub:

- OPENAI_API_KEY
- OPENAI_MODEL
- ELEVENLABS_API_KEY
- ELEVENLABS_VOICE_ID

The included `.env.example` contains names only, no secrets.

## Vercel

The repository includes `vercel.json` and `api/index.py`.
Import the GitHub repository into Vercel, then add the environment variables in Vercel Project Settings.

## Render / Railway

The repository also includes `server.py` and a `Procfile`.
Use the Python web service and configure the same environment variables.

## Included

- English, Spanish, Portuguese and French
- AI-backed Catholic guidance
- complete-Bible retrieval path
- Catholic Church teaching separated from tentative moral assessment
- Catechism references
- visible reconciliation action completion
- Scripture-reading completion
- journey/progress tracking
- prevention guidance
- Confession preparation
- full suggested prayer
- multilingual neural narration through ElevenLabs
- no synthetic browser voice fallback

## Security

Never commit API keys to GitHub.

## Status

This is still an Alpha / technical MVP. Before a public religious-guidance launch it needs Catholic theologian/priest review, Catechism citation validation, privacy/security hardening, scrupulosity safeguards, and production-grade user/account infrastructure.
