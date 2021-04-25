import { render, screen, within } from "@testing-library/react";

import { Wrapper } from "../../App";
import { Concepts } from "../../mocks/handlers";
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
});
