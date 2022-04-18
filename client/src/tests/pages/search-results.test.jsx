import fs from 'fs';

import '@testing-library/jest-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../helper-functions/renderWithRouter';

import SearchResults from '../../pages/search-results';
import { generateExportFileContent } from '../../pages/search-results';

import testData from '../resources/test-search-result-data.json';

const testId = 'search-results-testId';

let history = {};
let searchResultsPage = {};

let tsvContentSnapshot = '';

try {
  tsvContentSnapshot = fs.readFileSync(
    'src/tests/resources/test-tsv-generation-snapshot.tsv',
    'utf8'
  );
} catch (err) {
  console.error(err);
}

beforeEach(() => {
  jest.resetAllMocks();

  ({ history } = renderWithRouter(
    '/search',
    <SearchResults />,
    testId
  ));
  searchResultsPage = screen.queryByTestId(testId);
  expect(searchResultsPage).toBeTruthy();
});

describe('<SearchResults />', () => {
  describe('Success', () => {
    it('renders the SearchResults page', () => {
      // intentionally empty; testing beforeEach
    });

    it('exports to TSV correctly', () => {
        const generatedTSVContent = generateExportFileContent(testData.results, '\t', ['key', 'created_at', 'id']);
        expect(generatedTSVContent).toEqual(tsvContentSnapshot);
    });
  });
});
