import { Hono } from "hono";
import { cors } from "hono/cors";
import { TimelineDO } from "./timeline";
import { SimulationWorkflow } from "./simulation";
import { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Trigger a new simulation
app.post("/api/simulate", async (c) => {
  const { userInput } = await c.req.json();
  const id = c.env.TIMELINE_DO.idFromName("global-timeline"); // Single global timeline for this demo
  const stub = c.env.TIMELINE_DO.get(id);

  // Start the workflow
  await c.env.SIMULATION_WORKFLOW.create({
    params: {
      userInput,
      timelineId: id.toString(),
    },
  });

  return c.json({ status: "started", timelineId: id.toString() });
});

// Get the timeline tree
app.get("/api/timeline", async (c) => {
  const id = c.env.TIMELINE_DO.idFromName("global-timeline");
  const stub = c.env.TIMELINE_DO.get(id);
  const tree = await stub.fetch("http://do/tree").then((res) => res.json());
  return c.json(tree);
});

export default {
  fetch: app.fetch,
}

// We need to export these classes so the Worker runtime finds them
export { TimelineDO, SimulationWorkflow };


