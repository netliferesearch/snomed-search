import { rest } from "msw";

const handlers = [
  rest.get("/some/api", async (req, res, ctx) => {
    return res(ctx.json({ data: { id: 1 } }));
  }),
];
export { handlers };
