import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  renderWithRouter,
  rerenderWithRouter,
} from '../helper-functions/renderWithRouter';

import Header from '../../components/header';

const testId = 'header-testId';

let header = {};
let history = {};
let rerenderHook = () => {};

beforeEach(() => {
  ({ history, rerenderHook } = renderWithRouter(
    '/search',
    <Header onClickDownload={jest.fn()} />,
    testId
  ));
  header = screen.queryByTestId(testId);
  expect(header).toBeTruthy();
});

const rerenderHeader = (onClick) => {
  return rerenderWithRouter(
    history,
    <Header onClickDownload={onClick} />,
    testId,
    rerenderHook
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
      rerenderHeader();
      expect(header).toBeTruthy();

      const downloadButton = screen.queryByLabelText('download');

      expect(header).not.toContainElement(downloadButton);
    });

    it('calls onClickDownload when the TSV button is clicked', () => {
      const onClickDownload = jest.fn(() => {});

      rerenderHeader(onClickDownload);
      expect(header).toBeTruthy();

      fireEvent.click(screen.getByLabelText('download'));
      expect(onClickDownload).toHaveBeenCalled();
    });

    it('navigates to / when logo is clicked', () => {
      expect(history.location.pathname).toBe('/search');
      fireEvent.click(screen.getByAltText(/university logo/i));
      expect(history.location.pathname).toBe('/');
    });

    it('navitgates to /admin when Admin button is clicked', () => {
      expect(history.location.pathname).toBe('/search');
      fireEvent.click(screen.getByText(/admin/i));
      expect(history.location.pathname).toBe('/admin');
    });
  });
});
