import { render, screen } from "@testing-library/react";
import { rest } from "msw";

import { Wrapper } from "../../App";
import { Concepts } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { hostConfig } from "../__data__/config";
import CodeSystemList from "../CodeSystemList";

describe("Given that the CodeSystemList component should be rendered", () => {
  describe("When there is code system data for the concept", () => {
    it("Then the code system data is visible", async () => {
      render(
        <Wrapper>
          <CodeSystemList
            hostConfig={hostConfig}
            conceptId={Concepts.Skjoldbruskkjertelkreft}
          />
        </Wrapper>
      );

      const status = screen.getByRole("status");
      expect(status).toBeVisible();
      expect(status).toHaveTextContent("Loading...");

      const codeSystemName = await screen.findByText("ICPC-2");
      expect(codeSystemName).toBeVisible();
      const code = screen.getByText("T71");
      expect(code).toBeVisible();
    });
  });

  describe("When code systems fail to load", () => {
    it("Then an error message is displayed", async () => {
      server.use(
        rest.get(
          "https://snowstorm.rundberg.no/browser/main/ICPC2/members",
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );

      render(
        <Wrapper>
          <CodeSystemList
            hostConfig={hostConfig}
            conceptId={Concepts.Skjoldbruskkjertelkreft}
          />
        </Wrapper>
      );

      const error = await screen.findByRole("alert");
      expect(error).toBeVisible();
      expect(error).toHaveTextContent("Failed to load code systems");
    });
  });
});
