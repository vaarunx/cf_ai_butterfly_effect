# The Butterfly Effect (`cf_ai_butterfly_effect`)

> A "What If" history simulator powered by Cloudflare Workers AI.

## Project Overview
This application allows users to change one historical event and visualize the rippling consequences across time.
It uses:
-   **Cloudflare Workers AI (Llama 3.3)**: To generate the "alternate history" narratives.
-   **Cloudflare Workflows**: To chain the recursive simulation steps (Year 1 -> Year 10 -> Year 100).
-   **Durable Objects**: To persist the global "Tree of Time" (the multiverse of all user simulations).
-   **React + Vite**: For the frontend visualization.

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Locally**
    ```bash
    npm run dev
    ```

3.  **Deploy**
    ```bash
    npm run deploy
    ```

## Usage
1.  Open the app.
2.  Enter a "What If" scenario (e.g., "What if the internet was never invented?").
3.  Watch as the AI generates the immediate, short-term, and long-term consequences.
4.  Explore the branching timeline of all user submissions.
