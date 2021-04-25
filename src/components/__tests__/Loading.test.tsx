import { render, screen } from "@testing-library/react";

import { Wrapper } from "../../App";
import Loading from "../Loading";

describe("Given that the Loading component should be rendered", () => {
  describe("When it has rendered", () => {
    it("Then it contains a loading status message", async () => {
      render(
        <Wrapper>
          <Loading />
        </Wrapper>
      );

      const status = screen.getByRole("status");
      expect(status).toBeVisible();
      expect(status).toHaveTextContent("Loading...");
    });
  });
});
