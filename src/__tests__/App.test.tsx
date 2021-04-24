import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App, { Wrapper } from "../App";

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    hosts: [
      {
        hostname: "https://snowstorm.rundberg.no/branches",
        defaultBranch: "MAIN",
        codeSystems: [
          {
            branch: "MAIN/ICPC2",
            id: "450993002",
            title: "ICPC-2",
          },
        ],
        referenceSets: [
          {
            id: "1991000202102",
            title: "Sykdommer",
          },
        ],
        languages: ["nb", "nn", "no"],
      },
    ],
  },
}));

describe("Given that the Search component should be rendered", () => {
  describe("When you search for a concept", () => {
    it("Then the search result contains info about the concept", async () => {
      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const hostSelect = await screen.findByLabelText("Host");
      expect(hostSelect).toBeVisible();

      const branchSelect = screen.getByLabelText("Branch");
      expect(branchSelect).toBeVisible();

      const refsetSelect = screen.getByLabelText("Reference set");
      expect(refsetSelect).toBeVisible();
      userEvent.selectOptions(refsetSelect, "1991000202102");

      const searchInput = screen.getByLabelText("Search");
      expect(searchInput).toBeVisible();

      userEvent.type(searchInput, "Skjoldbruskkjertelkreft");

      const results = await screen.findByLabelText(
        'Results in refset "Sykdommer"'
      );

      const hits = within(results).getByText("1 hit");
      expect(hits).toBeVisible();

      const preferredTerm = within(results).getByLabelText(
        "Skjoldbruskkjertelkreft"
      );
      expect(preferredTerm).toBeVisible();

      const fullySpecifiedName = within(preferredTerm).getByText(
        "Malignant tumor of thyroid gland (disorder)"
      );
      expect(fullySpecifiedName).toBeVisible();

      const snomedCt = within(preferredTerm).getByText("363478007");
      expect(snomedCt).toBeVisible();

      const synonym = await within(preferredTerm).findByText(
        "Kreft i skjoldbruskkjertelen"
      );
      expect(synonym).toBeVisible();

      const icpc2 = await within(preferredTerm).findByText("T71");
      expect(icpc2).toBeVisible();
    });
  });

  describe("When you want to add a concept to a refset", () => {
    it("Then the concept can be found and added", async () => {
      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const refsetSelect = await screen.findByLabelText("Reference set");

      userEvent.selectOptions(refsetSelect, "1991000202102");

      const searchInput = screen.getByLabelText("Search");
      userEvent.clear(searchInput);
      userEvent.type(searchInput, "Halsbrann");

      const refSetresults = await screen.findByLabelText(
        'Results in refset "Sykdommer"'
      );
      within(refSetresults).getByText("0 hits");

      const suggestions = await screen.findByLabelText("Suggestions");

      const suggestion = within(suggestions).getByLabelText("Halsbrann");
      const addButton = within(suggestion).getByRole("button", {
        name: "Add to refset",
      });

      userEvent.click(addButton);

      // TODO: Sjekk at konseptet er lagt til refsetet
      // await within(refSetresults).findByText("1 hit");

      // const preferredTerm = within(refSetresults).getByLabelText("Halsbrann");
      // expect(preferredTerm).toBeVisible();
    });
  });

  describe("When you want to remove a concept to a refset", () => {
    it("Then the concept can be found and removed", async () => {
      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const refsetSelect = await screen.findByLabelText("Reference set");

      userEvent.selectOptions(refsetSelect, "1991000202102");

      const searchInput = screen.getByLabelText("Search");
      userEvent.clear(searchInput);
      userEvent.type(searchInput, "Skjoldbruskkjertelkreft");

      const refSetresults = await screen.findByLabelText(
        'Results in refset "Sykdommer"'
      );
      within(refSetresults).getByText("1 hit");

      const preferredTerm = within(refSetresults).getByLabelText(
        "Skjoldbruskkjertelkreft"
      );

      const removeButton = within(preferredTerm).getByRole("button", {
        name: "Remove from refset",
      });

      userEvent.click(removeButton);

      // TODO: Sjekk at konseptet er fjernet fra refsetet
      // await within(refSetresults).findByText("0 hits");

      // const suggestions = await screen.findByLabelText("Suggestions");

      // const suggestion = within(suggestions).getByLabelText("Skjoldbruskkjertelkreft");
      // expect(suggestion).toBeVisible();
    });
  });
});
