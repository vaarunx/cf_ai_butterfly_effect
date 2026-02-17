# The Butterfly Effect (`cf_ai_butterfly_effect`)

> A "What If" history simulator powered by Cloudflare Workers AI.

![Screenshot Placeholder](screenshots/demo.png)
*(Add a screenshot of the timeline UI here)*

## Project Overview

This application simulates the rippling consequences of changing a single historical event. It demonstrates a stateful, agentic AI application built entirely on the Cloudflare Developer Platform.

When a user enters a "What If" scenario (e.g., "What if the internet was never invented?"), the system:
1.  **Diverges**: Creates a new timeline branch.
2.  **Chains**: Uses autonomous Workflows to simulate the immediate (1 Year), short-term (10 Years), and long-term (100 Years) consequences.
3.  **Persists**: Saves every timeline to a global, shared "Multiverse" using Durable Objects.

## Features

-   **AI-Powered Narratives**: Uses **Llama 3.3** (via Workers AI) to generate realistic alternate history scenarios.
-   **Autonomous Workflows**: **Cloudflare Workflows** automatically chain simulations together without user intervention.
-   **Shared State**: **Durable Objects** provide a persistent, global backend that stores all user timelines in real-time.
-   **Modern UI**: A responsive **React + Vite** frontend that visualizes the branching paths of history.

## Tech Stack

-   **Cloudflare Workers**: Serverless compute.
-   **Workers AI**: Serverless inference (Llama 3.3).
-   **Cloudflare Workflows**: Durable execution for multi-step AI tasks.
-   **Durable Objects**: Transactional storage and state management.
-   **Hono**: Lightweight web framework for the API.
-   **React + Vite + Tailwind CSS**: Frontend.

## Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   Cloudflare Account

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
This command starts a local emulation of the entire Cloudflare stack (Workers, AI, Durable Objects, Workflows).
```bash
npm run dev
```
Open [http://localhost:8787](http://localhost:8787) to view the app.

### 3. Deploy to Cloudflare
```bash
npm run deploy
```

## Project Structure

-   `src/worker.ts`: Main entry point and API router.
-   `src/simulation.ts`: The Workflow definition that chains LLM calls.
-   `src/timeline.ts`: The Durable Object definition for storing state.
-   `client/`: The React frontend application.

## Assignment Requirements Met

-   [x] **LLM**: Uses `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
-   [x] **Workflow / Coordination**: Uses `WorkflowEntrypoint` for chaining simulation steps.
-   [x] **Memory / State**: Uses `DurableObject` for global state persistence.
-   [x] **User Input**: React frontend accepts user scenarios via HTTP POST.
