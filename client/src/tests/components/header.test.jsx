import React from 'react';

import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import renderWithRouter from '../helper-functions/renderWithRouter'

import Header from '../../components/header';

let header = {};
let historyGlobal = {};
let rerenderHeader = () => {};

beforeEach(() => {
  rerenderHeader = renderHeader(jest.fn()).rerender;
  expect(screen.queryByTestId('header')).toBeTruthy();
});

const renderHeader = (onClick, rerender) => {
  return renderWithRouter(
    '/search',
    <Header onClickDownload={onClick} />,
    'header',
    (history) => {
      header = screen.queryByTestId('header');
      historyGlobal = history;
    },
    rerender
  );
};

describe('<Header />', () => {
  describe('Success', () => {
    it('renders the Header component', () => {
      // intentionally empty; testing beforeEach
    });

    it('has all of its children', () => {
      const children = [
        screen.getByAltText(/university logo/i), //get logo
        screen.getByText(/search/i), // get search button
        screen.getByPlaceholderText(/search/i), // get searchbar
        screen.getByLabelText('download'), // get TSV download button
        screen.getByText(/admin/i), // get admin button
        screen.getByText(/help/i), // get help button
      ];

      for (const child of children) {
        expect(header).toContainElement(child);
      }
    });

    it('does not display the TSV button without an onClickDownload prop', () => {
      renderHeader(false, rerenderHeader);
      expect(header).toBeTruthy();

      const downloadBtn = screen.queryByLabelText('download');

      expect(header).not.toContainElement(downloadBtn);
    });

    it('calls onClickDownload when the TSV button is clicked', () => {
      const onClickDownload = jest.fn(() => {});

      renderHeader(onClickDownload, rerenderHeader);
      expect(header).toBeTruthy();

      fireEvent.click(screen.getByLabelText('download'));
      expect(onClickDownload).toHaveBeenCalled();
    });

    it('navigates to / when logo is clicked', () => {
      expect(historyGlobal.location.pathname).toBe('/search');
      fireEvent.click(screen.getByAltText(/university logo/i));
      expect(historyGlobal.location.pathname).toBe('/');
    });

    it('navitgates to /admin when Admin button is clicked', () => {
      expect(historyGlobal.location.pathname).toBe('/search');
      fireEvent.click(screen.getByText(/admin/i));
      expect(historyGlobal.location.pathname).toBe('/admin');
    });
  });
});
