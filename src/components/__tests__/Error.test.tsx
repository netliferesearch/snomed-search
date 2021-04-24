import { render, screen } from "@testing-library/react";

import Error from "../Error";

describe("Given that the Error component should be rendered", () => {
  describe("When it contains an error message", () => {
    it("Then the error message is visible", async () => {
      render(<Error>This is an error</Error>);

      const message = screen.getByText("This is an error");
      expect(message).toBeVisible();
    });
  });
});
