# -nodejs-demo-app

A sample Node.js web app with a fully automated CI/CD pipeline built on **GitHub Actions**. Every push to `main` automatically tests the code, builds a Docker image, and publishes it to **Docker Hub**.

## Objective

Automate code deployment using a CI/CD pipeline: **test → build → push**.

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js + Express | Sample web application |
| Jest + Supertest | Automated tests |
| Docker | Packages the app into an image |
| GitHub Actions | Runs the CI/CD pipeline |
| Docker Hub | Stores the published image |

## Project Structure

```
cicd-demo/
├── .github/
│   └── workflows/
│       └── main.yml      # CI/CD pipeline definition
├── app.js                # Express app and routes
├── server.js             # Starts the server on port 3000
├── app.test.js           # Automated tests
├── package.json          # Dependencies and scripts
├── Dockerfile            # Instructions to build the image
└── README.md
```

## The App

| Route | Response |
|---|---|
| `/` | `Hello from CI/CD pipeline! 🚀` |
| `/health` | `{ "status": "ok" }` |

## How the Pipeline Works

The workflow lives in `.github/workflows/main.yml` and is triggered on every **push to the `main` branch**.

```
git push → build job (install + test) → deploy job (Docker build + push to Docker Hub)
```

### Job 1: `build`
1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies (`npm install`)
4. Runs the tests (`npm test`)

### Job 2: `deploy`
Runs **only if `build` succeeds** (`needs: build`).
1. Checks out the code
2. Logs in to Docker Hub using repository secrets
3. Builds the Docker image from the `Dockerfile`
4. Pushes the image with two tags:
   - `latest`
   - the commit SHA (for traceability and rollbacks)

If any test fails, the pipeline stops and nothing is published.

## Required GitHub Secrets

Set these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | A Docker Hub access token (Read & Write) |

## Run the Published Image

```bash
docker pull jigynashu9/cicd-demo:latest
docker run -p 3000:3000 jigynashu9/cicd-demo:latest
```

Then open http://localhost:3000.

## Run Locally (requires Node.js)

```bash
npm install
npm test
npm start
```

## Author
jigyanshu pradhan
