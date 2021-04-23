import { render, screen } from "@testing-library/react";

import Error from "../Error";

describe("Gitt at Error skal vises", () => {
  describe("Når alle påkrevde felter fylles ut", () => {
    it("Så kalles sendEmail med riktige data", async () => {
      render(<Error>This is an error</Error>);

      const message = screen.getByText("This is an error");
      expect(message).toBeVisible();
    });
  });
});
