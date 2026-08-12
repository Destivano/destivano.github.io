/**
 * Personal AI Assistant — deployment configuration.
 *
 * This is the ONE value to edit when publishing the portfolio. GitHub Pages
 * serves plain static files with no build step, so there is no environment
 * variable injection here — this file *is* the configuration mechanism.
 *
 * Local development (docker compose / uvicorn on :8000):
 *   apiBase: "http://localhost:8000"
 *
 * Production, after you deploy the backend (see docs/deployment.md):
 *   apiBase: "https://<your-lambda-function-url>.lambda-url.<region>.on.aws"
 *   (or your CloudFront/custom-domain hostname in front of it, if you add one)
 *
 * Nothing secret belongs in this file — it is served to every visitor's
 * browser. The Groq API key lives only in the backend's environment and is
 * never sent to, or readable from, the frontend.
 */
window.PERSONAL_ASSISTANT_CONFIG = {
  apiBase: "https://452fiddxrkarhdzrkggq2pal7a0qzcce.lambda-url.eu-west-3.on.aws",
};
