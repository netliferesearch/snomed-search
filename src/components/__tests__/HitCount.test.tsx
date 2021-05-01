import { render, screen } from "@testing-library/react";

import { Wrapper } from "../../App";
import HitCount from "../HitCount";

describe("Given that the HitCount component should be rendered", () => {
  describe("When hits and total are undefined", () => {
    it("Then nothing is returned", async () => {
      const { container } = render(
        <Wrapper>
          <HitCount />
        </Wrapper>
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
  describe("When hits are undefined", () => {
    it("Then nothing is returned", async () => {
      const { container } = render(
        <Wrapper>
          <HitCount total={1} />
        </Wrapper>
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
  describe("When total is undefined", () => {
    it("Then the text renders correctly", async () => {
      render(
        <Wrapper>
          <HitCount hits={0} />
        </Wrapper>
      );

      const hits = screen.getByText("0 hits of 0 total");
      expect(hits).toBeVisible();
    });
  });
  describe("When there are 0/0 hits", () => {
    it("Then the text renders correctly", async () => {
      render(
        <Wrapper>
          <HitCount hits={0} total={0} />
        </Wrapper>
      );

      const hits = screen.getByText("0 hits of 0 total");
      expect(hits).toBeVisible();
    });
  });
  describe("When there are 1/1 hits", () => {
    it("Then the text renders correctly", async () => {
      render(
        <Wrapper>
          <HitCount hits={1} total={1} />
        </Wrapper>
      );

      const hits = screen.getByText("1 hit of 1 total");
      expect(hits).toBeVisible();
    });
  });
  describe("When there are 2/10 hits", () => {
    it("Then the text renders correctly", async () => {
      render(
        <Wrapper>
          <HitCount hits={2} total={10} />
        </Wrapper>
      );

      const hits = screen.getByText("2 hits of 10 total");
      expect(hits).toBeVisible();
    });
  });
});
