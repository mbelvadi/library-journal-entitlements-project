import React from 'react';

import '@testing-library/jest-dom';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithRouter } from '../helper-functions/renderWithRouter';

import DataTable from '../../components/data-table';

const testId = 'datatable-testId';

let history = {};
let dataTable = {};

beforeEach(() => {
  ({ history } = renderWithRouter('/search', <DataTable />, testId));
  dataTable = screen.queryByTestId(testId);
  expect(dataTable).toBeTruthy();
});

const fullClick = (element) => {
  fireEvent.mouseOver(element);
  fireEvent.mouseMove(element);
  fireEvent.mouseDown(element);
  element.focus();
  fireEvent.mouseUp(element);
  fireEvent.click(element);
};

describe('<DataTable />', () => {
  describe('Success', () => {
    it('renders the DataTable component', () => {
      // intentionally empty; testing beforeEach
    });

    it('displays data', () => {});

    it('sorts data', () => {});

    it('filters data', () => {});
  });
});
