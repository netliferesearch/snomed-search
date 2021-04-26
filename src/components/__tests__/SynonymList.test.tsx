import { render, screen, within } from "@testing-library/react";
import { rest } from "msw";

import { Wrapper } from "../../App";
import { Concepts } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { hostConfig } from "../__data__/config";
import SynonymList from "../SynonymList";

describe("Given that the SynonymList component should be rendered", () => {
  describe("When there are synonyms for the concept", () => {
    it("Then a list of synonyms is displayed", async () => {
      render(
        <Wrapper>
          <SynonymList
            hostConfig={hostConfig}
            branch="MAIN"
            preferredTerm="Skjoldbruskkjertelkreft"
            conceptId={Concepts.Skjoldbruskkjertelkreft}
          />
        </Wrapper>
      );

      const status = screen.getByRole("status");
      expect(status).toBeVisible();
      expect(status).toHaveTextContent("Loading...");

      const synonymList = await screen.findByLabelText("Synonyms");
      const firstSynonym = await within(synonymList).findByText(
        "Kreft i skjoldbruskkjertelen"
      );
      expect(firstSynonym).toBeVisible();
    });
  });

  describe("When code systems fail to load", () => {
    it("Then an error message is displayed", async () => {
      server.use(
        rest.get(
          "https://snowstorm.rundberg.no/MAIN/descriptions",
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );

      render(
        <Wrapper>
          <SynonymList
            hostConfig={hostConfig}
            branch="MAIN"
            preferredTerm="Skjoldbruskkjertelkreft"
            conceptId={Concepts.Skjoldbruskkjertelkreft}
          />
        </Wrapper>
      );

      const error = await screen.findByRole("alert");
      expect(error).toBeVisible();
      expect(error).toHaveTextContent("Failed to load synonyms");
    });
  });
});
