import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button, { ButtonVariant } from "../Button";

describe("Given that the Button component should be rendered", () => {
  describe("When the button is clicked", () => {
    it("Then the onClick function is called", async () => {
      const mockClick = jest.fn();

      render(
        <Button onClick={mockClick} variant={ButtonVariant.Primary}>
          Add to refset
        </Button>
      );

      const button = screen.getByRole("button", { name: "Add to refset" });
      expect(button).toBeVisible();
      userEvent.click(button);

      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });
});
