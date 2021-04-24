import { rest } from "msw";

import branches from "./__data__/branches.json";
import descriptions from "./__data__/descriptions.json";
import icpc2 from "./__data__/icpc2.json";
import synonyms from "./__data__/synonyms.json";

const handlers = [
  rest.get("https://snowstorm.rundberg.no/branches", async (req, res, ctx) => {
    return res(ctx.json(branches));
  }),
  rest.get(
    "https://snowstorm.rundberg.no/browser/MAIN/descriptions",
    async (req, res, ctx) => {
      return res(ctx.json(descriptions));
    }
  ),
  rest.get(
    "https://snowstorm.rundberg.no/MAIN/descriptions",
    async (req, res, ctx) => {
      return res(ctx.json(synonyms));
    }
  ),
  rest.get(
    "https://snowstorm.rundberg.no/browser/MAIN/ICPC2/members",
    async (req, res, ctx) => {
      return res(ctx.json(icpc2));
    }
  ),
];
export { handlers };
