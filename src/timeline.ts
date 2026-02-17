import { DurableObject } from "cloudflare:workers";
import { Env } from "./types";

export interface HistoryNode {
  id: string;
  parentId: string | null;
  year: number; // 1, 10, 100
  description: string;
  createdBy: string; // "user" or "AI"
  createdAt: string;
}

export class TimelineDO extends DurableObject {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.state = state;
  }

  async addNode(node: HistoryNode) {
    const nodes = (await this.state.storage.get<Record<string, HistoryNode>>("nodes")) || {};
    nodes[node.id] = node;
    await this.state.storage.put("nodes", nodes);
    return node;
  }

  async getTree() {
    const nodes = (await this.state.storage.get<Record<string, HistoryNode>>("nodes")) || {};
    return Object.values(nodes);
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/add") {
      const node = await request.json<HistoryNode>();
      await this.addNode(node);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (url.pathname === "/tree") {
      const tree = await this.getTree();
      return new Response(JSON.stringify(tree), { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  }
}
