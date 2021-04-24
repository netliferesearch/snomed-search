import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

import App from "../App";

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
            id: "1981000202104",
            title: "Målgruppe",
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
        <Router>
          <QueryParamProvider ReactRouterRoute={Route}>
            <App />
          </QueryParamProvider>
        </Router>
      );

      const hostSelect = await screen.findByLabelText("Host");
      expect(hostSelect).toBeVisible();

      const branchSelect = screen.getByLabelText("Branch");
      expect(branchSelect).toBeVisible();

      const refsetSelect = screen.getByLabelText("Reference set");
      expect(refsetSelect).toBeVisible();

      const searchInput = screen.getByLabelText("Search");
      expect(searchInput).toBeVisible();

      userEvent.type(searchInput, "Skjoldbruskkjertelkreft");

      const hits = await screen.findByText("1 hit");
      expect(hits).toBeVisible();

      const preferredTerm = await screen.findByLabelText(
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
});
