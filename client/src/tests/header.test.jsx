import React from 'react';
import Button from 'antd';
import { Router, Link } from 'react-router-dom';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import Header from '../components/header';

let rerenderHeader = () => {};

const renderWithRouter = (route, component, testId) => {
  const history = createMemoryHistory({ initialEntries: [route] });

  return render(
    <Router location={history.location} navigator={history}>
      <div data-testid={testId}>{component}</div>
    </Router>
  );
};

beforeEach(() => {
  rerenderHeader = renderWithRouter(
    '/search',
    <Header onClickDownload={() => {}} />,
    'header'
  ).rerender;
});

test('Header should have all of its children', () => {
  const children = [
    screen.getByAltText(/university logo/i), //get logo
    screen.getByText(/search/i), // get search button
    screen.getByPlaceholderText(/search/i), // get searchbar
    screen.getByLabelText('download'), // get TSV download button
    screen.getByText(/admin/i), // get admin button
    screen.getByText(/help/i), // get help button
  ];

  for (const child of children) {
    expect(screen.getByTestId('header')).toContainElement(child);
  }
});

test('Header should not display TSV button with no onClickDownload prop', () => {
  rerenderHeader(
    <Router location={history.location} navigator={history}>
      <div data-testid={'header'}>
        <Header />
      </div>
    </Router>
  );

  const downloadBtn = screen.queryByLabelText('download');

  expect(screen.getByTestId('header')).not.toContainElement(downloadBtn);
});
