import { render, screen } from "@testing-library/react";

import { Wrapper } from "../../App";
import { Concepts } from "../../mocks/handlers";
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
});
