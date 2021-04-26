import { render, screen } from "@testing-library/react";

import Error from "../Error";

describe("Given that the Error component should be rendered", () => {
  describe("When it contains an error message", () => {
    it("Then the error message is visible", async () => {
      render(<Error>This is an error</Error>);

      const alert = screen.getByRole("alert");
      expect(alert).toBeVisible();
      expect(alert).toHaveTextContent("This is an error");
    });
  });
});
