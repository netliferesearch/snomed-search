import { rest } from "msw";

import branches from "./__data__/branches.json";
import halsbrannDescriptions from "./__data__/halsbrann/descriptions.json";
import descriptions from "./__data__/skjoldbruskkjertelkreft/descriptions.json";
import icpc2 from "./__data__/skjoldbruskkjertelkreft/icpc2.json";
import members from "./__data__/skjoldbruskkjertelkreft/members.json";
import synonyms from "./__data__/skjoldbruskkjertelkreft/synonyms.json";

export enum Concepts {
  Halsbrann = "16331000",
  Skjoldbruskkjertelkreft = "363478007",
}

export enum Endpoints {
  BranchIndex = "https://snowstorm.rundberg.no/branches",
  ConceptIndex = "https://snowstorm.rundberg.no/browser/MAIN/descriptions",
  SynonymIndex = "https://snowstorm.rundberg.no/MAIN/descriptions",
  CodeSystemIndex = "https://snowstorm.rundberg.no/browser/MAIN/ICPC2/members",
  RefsetIndex = "https://snowstorm.rundberg.no/MAIN/members",
  RefsetDelete = "https://snowstorm.rundberg.no/MAIN/members/:memberId",
}

const handlers = [
  /**
   * Get branch list
   */
  rest.get(Endpoints.BranchIndex, (req, res, ctx) => {
    return res(ctx.json(branches));
  }),

  /**
   * Search for concepts
   */
  rest.get(Endpoints.ConceptIndex, (req, res, ctx) => {
    if (req.url.searchParams.get("term") === "Halsbrann") {
      return res(ctx.json(halsbrannDescriptions));
    } else if (req.url.searchParams.get("term") === "Skjoldbruskkjertelkreft") {
      return res(ctx.json(descriptions));
    }

    return;
  }),

  /**
   * Search for synonyms
   */
  rest.get(Endpoints.SynonymIndex, (req, res, ctx) => {
    if (
      req.url.searchParams.get("concept") === Concepts.Skjoldbruskkjertelkreft
    ) {
      return res(ctx.json(synonyms));
    } else if (req.url.searchParams.get("concept") === Concepts.Halsbrann) {
      return res(ctx.json({ items: [] }));
    }

    return;
  }),

  /**
   * Search codesystems (eg. ICPC2)
   */
  rest.get(Endpoints.CodeSystemIndex, (req, res, ctx) => {
    if (
      req.url.searchParams.get("referencedComponentId") ===
      Concepts.Skjoldbruskkjertelkreft
    ) {
      return res(ctx.json(icpc2));
    } else if (
      req.url.searchParams.get("referencedComponentId") === Concepts.Halsbrann
    ) {
      return res(ctx.json({ items: [] }));
    }
    return;
  }),

  /**
   * Search refset
   */
  rest.get(Endpoints.RefsetIndex, (req, res, ctx) => {
    if (
      req.url.searchParams.get("referencedComponentId") ===
      Concepts.Skjoldbruskkjertelkreft
    ) {
      return res(ctx.json(members));
    } else if (
      req.url.searchParams.get("referencedComponentId") === Concepts.Halsbrann
    ) {
      return res(ctx.json({ items: [] }));
    }
    return;
  }),

  /**
   * Add concept to refset
   */
  rest.post(Endpoints.RefsetIndex, (req, res, ctx) => {
    return res(ctx.json({}));
  }),

  /**
   * Remove concept from refset
   */
  rest.delete(Endpoints.RefsetDelete, (req, res, ctx) => {
    return res(ctx.text(""));
  }),
];
export { handlers };
