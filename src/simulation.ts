import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from "cloudflare:workers";
import { Env } from "./types";

export class SimulationWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const { userInput, timelineId } = event.payload;

    // We need to stub the DO to save results
    const id = this.env.TIMELINE_DO.idFromString(timelineId);
    const stub = this.env.TIMELINE_DO.get(id);

    // Initial Node (The Divergence)
    await step.do("record-divergence", async () => {
      await stub.fetch("http://do/add", {
        method: "POST",
        body: JSON.stringify({
          id: crypto.randomUUID(),
          parentId: null, // Root of this specific timeline
          year: 0,
          description: userInput,
          createdBy: "user",
          createdAt: new Date().toISOString(),
        }),
      });
    });

    // Step 1: Year 1
    const year1 = await step.do("simulate-year-1", async () => {
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          {
            role: "system",
            content: "You are an alternate history simulator. Describe the immediate consequences (1 year later) of the user's change. Keep it under 100 words.",
          },
          {
            role: "user",
            content: `The change is: ${userInput}`,
          },
        ],
      });
      return response.response; // Verify the response format
    });

    await step.do("save-year-1", async () => {
        // In a real app we'd link this properly with parent IDs, but for simplicity let's just dump it
         await stub.fetch("http://do/add", {
            method: "POST",
            body: JSON.stringify({
              id: crypto.randomUUID(),
              parentId: null, // TODO: Link to previous node
              year: 1,
              description: year1,
              createdBy: "AI",
              createdAt: new Date().toISOString(),
            }),
          });
    });

    // Step 2: Year 10
    const year10 = await step.do("simulate-year-10", async () => {
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          {
            role: "system",
            content: "Describe the world 10 years later based on the previous event. Keep it under 100 words.",
          },
          {
            role: "user",
            content: `Previous event (Year 1): ${year1}`,
          },
        ],
      });
      return response.response;
    });

     await step.do("save-year-10", async () => {
         await stub.fetch("http://do/add", {
            method: "POST",
            body: JSON.stringify({
              id: crypto.randomUUID(),
              parentId: null,
              year: 10,
              description: year10,
              createdBy: "AI",
              createdAt: new Date().toISOString(),
            }),
          });
    });

    // Step 3: Year 50
    const year50 = await step.do("simulate-year-50", async () => {
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          {
            role: "system",
            content: "You are an alternate history simulator. Describe the world 50 years later based on the previous event. Keep it under 100 words.",
          },
          {
            role: "user",
            content: `Previous event (Year 10): ${year10}`,
          },
        ],
      });
      return response.response;
    });

     await step.do("save-year-50", async () => {
         await stub.fetch("http://do/add", {
            method: "POST",
            body: JSON.stringify({
              id: crypto.randomUUID(),
              parentId: null,
              year: 50,
              description: year50,
              createdBy: "AI",
              createdAt: new Date().toISOString(),
            }),
          });
    });

    // Step 4: Year 100
    const year100 = await step.do("simulate-year-100", async () => {
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          {
            role: "system",
            content: "You are an alternate history simulator. Describe the world 100 years later based on the previous event. Keep it under 100 words.",
          },
          {
            role: "user",
            content: `Previous event (Year 50): ${year50}`,
          },
        ],
      });
      return response.response;
    });

     await step.do("save-year-100", async () => {
         await stub.fetch("http://do/add", {
            method: "POST",
            body: JSON.stringify({
              id: crypto.randomUUID(),
              parentId: null,
              year: 100,
              description: year100,
              createdBy: "AI",
              createdAt: new Date().toISOString(),
            }),
          });
    });

    // Step 5: Year 250
    const year250 = await step.do("simulate-year-250", async () => {
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          {
            role: "system",
            content: "You are an alternate history simulator. Describe the world 250 years later based on the previous event. Keep it under 100 words.",
          },
          {
            role: "user",
            content: `Previous event (Year 100): ${year100}`,
          },
        ],
      });
      return response.response;
    });

     await step.do("save-year-250", async () => {
         await stub.fetch("http://do/add", {
            method: "POST",
            body: JSON.stringify({
              id: crypto.randomUUID(),
              parentId: null,
              year: 250,
              description: year250,
              createdBy: "AI",
              createdAt: new Date().toISOString(),
            }),
          });
    });

    return { year1, year10, year50, year100, year250 };
  }
}



interface Params {
  userInput: string;
  timelineId: string;
}
