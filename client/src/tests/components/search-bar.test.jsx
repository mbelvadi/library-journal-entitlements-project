import React from 'react';

import '@testing-library/jest-dom';
import { screen, fireEvent, act } from '@testing-library/react';
import renderWithRouter from '../helper-functions/renderWithRouter';

import SearchBar from '../../components/search-bar';

let history = {};

beforeEach(() => {
  renderSearchBar();
  expect(screen.queryByTestId('searchbar')).toBeTruthy();
});

const renderSearchBar = () => {
  return renderWithRouter('/', <SearchBar />, 'searchbar', (historyLocal) => {
    history = historyLocal;
  });
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
        screen.getByPlaceholderText(/search/i), // get search input
        getInvisibleSubmitButton(), // invisible button (used for submitting when pressing 'enter' on searchbar)
        screen.getByText(/search/i), // get search button
      ];

      for (const child of children) {
        expect(searchBar).toContainElement(child);
      }
    });

    const enterQueryIntoInput = (query) => {
      const input = screen.getByPlaceholderText(/search/i);
      act(() => {
        fireEvent.change(input, { target: { value: query } });
      });
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

      expect(history.location.pathname).toBe('/');
      act(() => {
        fireEvent.click(screen.getByText(/search/i));
      });
      expect(history.location.pathname).toBe('/search');
    });

    const fullClick = (element) => {
      fireEvent.mouseOver(element);
      fireEvent.mouseMove(element);
      fireEvent.mouseDown(element);
      element.focus();
      fireEvent.mouseUp(element);
      fireEvent.click(element);
    };

    it('adds filter years as URL parameters', () => {
      let filterButton = screen.getByLabelText(/filter/i);

      act(() => {
        fireEvent.click(filterButton);
      });

      const datepickers = screen.getAllByPlaceholderText(/select year/i);
      const years = [];
      let year = 2000;

      for (const datepicker of datepickers) {
        act(() => {
          fullClick(datepicker);
          fireEvent.change(datepicker, { target: { value: (year += 1) } });
        });

        years.push(year + '');
      }

      act(() => {
        fullClick(datepickers[0]);
      });

      enterQueryIntoInput('chemical');
      expect(history.location.pathname).toBe('/');
      act(() => {
        fireEvent.click(screen.getByText(/search/i));
      });

      for (const year of years) {
        expect(history.location.search).toContain(year);
      }
    });
  });
});
