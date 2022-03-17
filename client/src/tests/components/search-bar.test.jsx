import React from 'react';

import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import renderWithRouter from '../helper-functions/renderWithRouter';

import SearchBar from '../../components/search-bar';

let searchBar = {};
let history = {};

beforeEach(() => {
  renderSearchBar();
  expect(screen.queryByTestId('searchbar')).toBeTruthy();
});

const renderSearchBar = () => {
  return renderWithRouter(
    '/',
    <SearchBar />,
    'searchbar',
    (historyLocal) => {
      searchBar = screen.queryByTestId('searchbar');
      history = historyLocal;
    }
  );
};

const getInvisibleSubmitButton = () => {
  return screen.getAllByRole(/button/i, { hidden: true }).filter((button) => {
    if (button.style.display === 'none') return button;
    else return undefined;
  })[0];
};

describe('<SearchBar />', () => {
  describe('Success', () => {
    it('renders the SearchBar component', () => {
      // intentionally empty; testing beforeEach
    });

    it('has all of its children', () => {
      const children = [
        screen.getByPlaceholderText(/search/i), // get searchbar
        getInvisibleSubmitButton(), // invisible button (used for submitting when pressing 'enter' on searchbar)
        screen.getByText(/search/i), // get search button
      ];

      for (const child of children) {
        expect(searchBar).toContainElement(child);
      }
    });

    const enterQueryIntoInput = (query) => {
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: query } });
      expect(input.value).toBe(query);
    };

    it('allows text to be entered into the Input', () => {
      enterQueryIntoInput('chemical');
    });

    it('allows submitting by "clicking" the invisible submit button', () => {
      enterQueryIntoInput('chemical');

      fireEvent.click(getInvisibleSubmitButton());

      expect(history.location.pathname).toBe('/search');
    });

    it('allows submitting the form when clicking the search button', () => {
      enterQueryIntoInput('chemical');

      expect(historyGlobal.location.pathname).toBe('/');
      fireEvent.click(screen.getByText(/search/i));
      expect(historyGlobal.location.pathname).toBe('/search');
    });
  });
});
