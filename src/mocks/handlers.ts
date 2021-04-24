import { rest } from "msw";

import branches from "./__data__/branches.json";
import halsbrannDescriptions from "./__data__/halsbrann/descriptions.json";
import descriptions from "./__data__/skjoldbruskkjertelkreft/descriptions.json";
import icpc2 from "./__data__/skjoldbruskkjertelkreft/icpc2.json";
import synonyms from "./__data__/skjoldbruskkjertelkreft/synonyms.json";

const handlers = [
  rest.get("https://snowstorm.rundberg.no/branches", async (req, res, ctx) => {
    return res(ctx.json(branches));
  }),
  rest.get(
    "https://snowstorm.rundberg.no/browser/MAIN/descriptions",
    async (req, res, ctx) => {
      if (
        req.url.searchParams.get("term") === "Halsbrann" &&
        req.url.searchParams.get("conceptRefset") === "1991000202102"
      ) {
        return res(ctx.json({ items: [] }));
      } else if (req.url.searchParams.get("term") === "Halsbrann") {
        return res(ctx.json(halsbrannDescriptions));
      } else if (
        req.url.searchParams.get("term") === "Skjoldbruskkjertelkreft"
      ) {
        return res(ctx.json(descriptions));
      }

      return res(ctx.json({ items: [] }));
    }
  ),
  rest.get(
    "https://snowstorm.rundberg.no/MAIN/descriptions",
    async (req, res, ctx) => {
      if (req.url.searchParams.get("concept") === "363478007") {
        return res(ctx.json(synonyms));
      }
      return res(ctx.json({ items: [] }));
    }
  ),
  rest.get(
    "https://snowstorm.rundberg.no/browser/MAIN/ICPC2/members",
    async (req, res, ctx) => {
      if (req.url.searchParams.get("referencedComponentId") === "363478007") {
        return res(ctx.json(icpc2));
      }
      return res(ctx.json({ items: [] }));
    }
  ),
  rest.post(
    "https://snowstorm.rundberg.no/MAIN/members",
    async (req, res, ctx) => {
      return res(ctx.json({}));
    }
  ),
];
export { handlers };
