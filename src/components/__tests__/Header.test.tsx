import { render, screen } from "@testing-library/react";

import { Wrapper } from "../../App";
import Header from "../Header";

describe("Given that the Header component should be rendered", () => {
  describe("When it has rendered", () => {
    it("Then it contains a navigation link", async () => {
      render(
        <Wrapper>
          <Header />
        </Wrapper>
      );

      const link = screen.getByRole("link", { name: "All" });
      expect(link).toBeVisible();
      expect(link).toHaveAttribute("href", "/");
    });
  });
});
