import { render, screen } from "@testing-library/react";

import { Wrapper } from "../../App";
import { Concepts, Endpoints } from "../../mocks/handlers";
import { respondServerError } from "../../mocks/response";
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
      respondServerError(Endpoints.CodeSystemIndex);

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
