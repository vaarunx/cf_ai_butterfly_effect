# AI Prompts & Development Process

This project was built using a series of iterative prompts to design the architecture, implement the Cloudflare-specific components, and refine the frontend UI. Below are the key prompts used to guide the AI assistant.

## 1. Architecture & Core Logic
"I want to build a 'Butterfly Effect' simulator on Cloudflare. The goal is to let users change one historical event and see the consequences ripple through time.
-   **Backend**: Use Cloudflare Workers.
-   **AI**: Use Llama 3.3 for generating the alternate history scenarios.
-   **State**: We need a way to chain simulations (Year 1 -> Year 10 -> Year 100) automatically without the user waiting. What's the best way to do this? Workflows?
-   **Persistence**: All timelines should be saved permanently so users can see a 'multiverse' of everyone's changes. Use Durable Objects for this."

## 2. The Simulation Chain (Workflow)
"Create a Cloudflare Workflow that takes a user's input (the point of divergence) and runs a multi-step simulation.
1.  **Step 1**: Generate the immediate aftermath (1 Year Later).
2.  **Step 2**: Take the output of Year 1 and generate Year 10.
3.  **Step 3**: Take Year 10 and generate Year 50.
4.  **Step 4**: Take Year 50 and generate Year 100.
5.  **Step 5**: Finally, generate the distant future (Year 250).
For each step, save the result to the Durable Object so the frontend can update in real-time."

## 3. Frontend & Visualization
"Build a React frontend using Vite and Tailwind CSS.
-   It should look like a sci-fi 'Time Variance Authority' interface.
-   Use a dark theme with purple/neon accents.
-   Display the timelines as a branching tree or a list of 'detected timelines'.
-   Poll the backend every few seconds to see if new simulation steps have finished."

## 4. Refinements
"The jump from Year 10 to Year 100 is too jarring. Let's smooth it out by adding intermediate steps for Year 50 and Year 250. Also, color-code the cards so the user can visually distinguish the depth of the simulation (e.g., Purple for Divergence, Green for Year 100, Red for Year 250)."
