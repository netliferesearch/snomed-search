import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import App, { Wrapper } from '../App';
import halsbrannDescriptions from '../mocks/__data__/halsbrann/descriptions.json';
import descriptions from '../mocks/__data__/skjoldbruskkjertelkreft/descriptions.json';
import { Endpoints } from '../mocks/handlers';
import { respondServerError } from '../mocks/response';
import { server } from '../mocks/server';

jest.mock('../config', () => ({
  __esModule: true,
  default: {
    hosts: [
      {
        hostname: 'https://snowstorm.rundberg.no',
        defaultBranch: 'MAIN',
        codeSystems: [
          {
            branch: 'MAIN/ICPC2',
            id: '450993002',
            title: 'ICPC-2',
          },
        ],
        referenceSets: [
          {
            id: '1991000202102',
            title: 'Sykdommer',
          },
        ],
        languages: ['nb', 'nn', 'no'],
      },
    ],
  },
}));

describe('Given that the Search component should be rendered', () => {
  describe('When you search for a concept', () => {
    it('Then the search result contains info about the concept', async () => {
      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const hostSelect = await screen.findByLabelText('Host');
      expect(hostSelect).toBeVisible();

      const branchSelect = screen.getByLabelText('Branch');
      expect(branchSelect).toBeVisible();

      const refsetSelect = screen.getByLabelText('Reference set');
      expect(refsetSelect).toBeVisible();
      await waitFor(() => expect(refsetSelect).toBeEnabled());
      userEvent.selectOptions(refsetSelect, '1991000202102');

      const searchInput = screen.getByLabelText('Search');
      expect(searchInput).toBeVisible();

      userEvent.type(searchInput, 'Skjoldbruskkjertelkreft');

      const results = await screen.findByLabelText('Results in refset "Sykdommer"');

      const hits = within(results).getByText('1 hit of 1 total');
      expect(hits).toBeVisible();

      const preferredTerm = within(results).getByLabelText('Skjoldbruskkjertelkreft');
      expect(preferredTerm).toBeVisible();

      const fullySpecifiedName = within(preferredTerm).getByText('Malignant tumor of thyroid gland (disorder)');
      expect(fullySpecifiedName).toBeVisible();

      const snomedCt = within(preferredTerm).getByText('363478007');
      expect(snomedCt).toBeVisible();

      const synonymList = await within(preferredTerm).findByLabelText('Synonyms');
      const firstSynonym = await within(synonymList).findByText('Kreft i skjoldbruskkjertelen');
      expect(firstSynonym).toBeVisible();

      const icpc2 = await within(preferredTerm).findByText('T71');
      expect(icpc2).toBeVisible();
    });
  });

  describe('When you want to add a concept to a refset', () => {
    it('Then the concept can be found and added', async () => {
      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const refsetSelect = await screen.findByLabelText('Reference set');

      userEvent.selectOptions(refsetSelect, '1991000202102');

      server.use(
        rest.get(Endpoints.ConceptIndex, (req, res, ctx) => {
          // Return empty list for refset query
          if (req.url.searchParams.get('conceptRefset') === '1991000202102') {
            return res(ctx.json({ items: [] }));
          }

          // Include "Halsbrann" in suggestions
          return res(ctx.json(halsbrannDescriptions));
        })
      );

      const searchInput = screen.getByLabelText('Search');
      userEvent.clear(searchInput);
      userEvent.type(searchInput, 'Halsbrann');

      const refSetresults = await screen.findByLabelText('Results in refset "Sykdommer"');
      within(refSetresults).getByText('0 hits');

      const suggestions = await screen.findByLabelText('Suggestions');

      const suggestion = within(suggestions).getByLabelText('Halsbrann');
      const addButton = within(suggestion).getByRole('button', {
        name: 'Add to refset',
      });

      server.use(
        rest.get(Endpoints.ConceptIndex, (req, res, ctx) => {
          // Include "Halsbrann" in refset
          if (req.url.searchParams.get('conceptRefset') === '1991000202102') {
            return res(ctx.json(halsbrannDescriptions));
          }
          // Return empty list for refset query

          return res(ctx.json({ items: [] }));
        })
      );
      userEvent.click(addButton);
      await waitForElementToBeRemoved(addButton);

      const updatedRefsetResult = await screen.findByLabelText('Results in refset "Sykdommer"');
      within(updatedRefsetResult).getByText('1 hit of 1 total');

      const preferredTerm = within(updatedRefsetResult).getByLabelText('Halsbrann');
      expect(preferredTerm).toBeVisible();

      within(preferredTerm).getByRole('button', {
        name: 'Remove from refset',
      });
    });
  });

  describe('When you want to remove a concept to a refset', () => {
    it('Then the concept can be found and removed', async () => {
      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const refsetSelect = await screen.findByLabelText('Reference set');

      userEvent.selectOptions(refsetSelect, '1991000202102');

      const searchInput = screen.getByLabelText('Search');
      userEvent.clear(searchInput);
      userEvent.type(searchInput, 'Skjoldbruskkjertelkreft');

      const refSetresults = await screen.findByLabelText('Results in refset "Sykdommer"');
      within(refSetresults).getByText('1 hit of 1 total');

      const preferredTerm = within(refSetresults).getByLabelText('Skjoldbruskkjertelkreft');

      const removeButton = within(preferredTerm).getByRole('button', {
        name: 'Remove from refset',
      });

      server.use(
        rest.get(Endpoints.ConceptIndex, (req, res, ctx) => {
          // Return empty list for refset query
          if (req.url.searchParams.get('conceptRefset') === '1991000202102') {
            return res(ctx.json({ items: [] }));
          }
          // Include "Skjoldbruskkjertelkreft" in suggestions
          return res(ctx.json(descriptions));
        })
      );

      userEvent.click(removeButton);

      await waitForElementToBeRemoved(removeButton);

      const updatedRefsetResult = await screen.findByLabelText('Results in refset "Sykdommer"');
      within(updatedRefsetResult).getByText('0 hits');

      const suggestions = await screen.findByLabelText('Suggestions');

      const suggestion = within(suggestions).getByLabelText('Skjoldbruskkjertelkreft');
      expect(suggestion).toBeVisible();

      within(suggestion).getByRole('button', {
        name: 'Add to refset',
      });
    });

    describe('When branches fail to load', () => {
      it('Then an error message is displayed', async () => {
        respondServerError(Endpoints.BranchIndex);

        render(
          <Wrapper>
            <App />
          </Wrapper>
        );

        const error = await screen.findByRole('alert');
        expect(error).toBeVisible();
        expect(error).toHaveTextContent('Failed to load branches');
      });
    });

    describe('When concepts fail to load', () => {
      it('Then an error message is displayed', async () => {
        respondServerError(Endpoints.ConceptIndex);

        render(
          <Wrapper>
            <App />
          </Wrapper>
        );

        const error = await screen.findByRole('alert');
        expect(error).toBeVisible();
        expect(error).toHaveTextContent('Failed to load concepts');
      });
    });

    describe('When concept fails to be added to refset', () => {
      it('Then an error message is displayed', async () => {
        respondServerError(Endpoints.RefsetIndex, 'post');

        server.use(
          rest.get(Endpoints.ConceptIndex, (req, res, ctx) => {
            if (req.url.searchParams.get('conceptRefset') === '1991000202102') {
              return res(ctx.json({ items: [] }));
            }

            return res(ctx.json(halsbrannDescriptions));
          })
        );

        render(
          <Wrapper>
            <App />
          </Wrapper>
        );

        const refsetSelect = await screen.findByLabelText('Reference set');

        userEvent.selectOptions(refsetSelect, '1991000202102');

        const searchInput = screen.getByLabelText('Search');
        userEvent.clear(searchInput);
        userEvent.type(searchInput, 'Halsbrann');

        const addButton = await screen.findByRole('button', {
          name: 'Add to refset',
        });

        userEvent.click(addButton);
        await waitForElementToBeRemoved(addButton);

        const error = await screen.findByRole('alert');
        expect(error).toBeVisible();
        expect(error).toHaveTextContent('Failed to add concept to refset');
      });
    });

    describe('When concept fails to be removed from refset', () => {
      it('Then an error message is displayed', async () => {
        respondServerError(Endpoints.RefsetDelete, 'delete');

        render(
          <Wrapper>
            <App />
          </Wrapper>
        );

        const refsetSelect = await screen.findByLabelText('Reference set');

        userEvent.selectOptions(refsetSelect, '1991000202102');

        const searchInput = screen.getByLabelText('Search');
        userEvent.clear(searchInput);
        userEvent.type(searchInput, 'Skjoldbruskkjertelkreft');

        const removeButton = await screen.findByRole('button', {
          name: 'Remove from refset',
        });

        userEvent.click(removeButton);

        const error = await screen.findByRole('alert');
        expect(error).toBeVisible();
        expect(error).toHaveTextContent('Failed to remove concept from refset');
      });
    });
  });
});

describe('Given that the concept is already added to the refset', () => {
  describe('When trying to add it again', () => {
    it('Then an error message is displayed', async () => {
      server.use(
        rest.get(Endpoints.ConceptIndex, (req, res, ctx) => {
          // Return empty list for refset query
          if (req.url.searchParams.get('conceptRefset') === '1991000202102') {
            return res(ctx.json({ items: [] }));
          }
          // Include "Skjoldbruskkjertelkreft" in suggestions
          return res(ctx.json(descriptions));
        })
      );

      render(
        <Wrapper>
          <App />
        </Wrapper>
      );

      const refsetSelect = await screen.findByLabelText('Reference set');

      userEvent.selectOptions(refsetSelect, '1991000202102');

      const searchInput = screen.getByLabelText('Search');
      userEvent.clear(searchInput);
      userEvent.type(searchInput, 'Skjoldbruskkjertelkreft');

      const addButton = await screen.findByRole('button', {
        name: 'Add to refset',
      });

      userEvent.click(addButton);

      const error = await screen.findByRole('alert');
      expect(error).toBeVisible();
      expect(error).toHaveTextContent('Refset already contains this concept');
    });
  });
});
