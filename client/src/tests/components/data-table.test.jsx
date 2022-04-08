import React from 'react';

import '@testing-library/jest-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../helper-functions/renderWithRouter';

import DataTable from '../../components/data-table';

import testData from '../resources/test-search-results-data.json';

const testId = 'datatable-testId';

let history = {};
let dataTable = {};

const setDisplayedData = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();

  ({ history } = renderWithRouter(
    '/search',
    <DataTable data={testData} setDisplayedData={jest.fn()} loadingResults={false}
/>,
    testId
  ));
  dataTable = screen.queryByTestId(testId);
  expect(dataTable).toBeTruthy();
});

describe('<DataTable />', () => {
  describe('Success', () => {

    const fullClick = (element) => {
      fireEvent.mouseOver(element);
      fireEvent.mouseMove(element);
      fireEvent.mouseDown(element);
      element.focus();
      fireEvent.mouseUp(element);
      fireEvent.click(element);
    };


    it('renders the DataTable component', () => {
      // intentionally empty; testing beforeEach
    });

    it('renders the table header', () => {
      expect(screen.getByText('Has Rights')).toBeTruthy
    });

    it('renders the rows', () => {
      expect(document.getElementsByClassName('ant-table-row') > 0);
    });

    it('sorts data', () => {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";

      const tableHeaderColumns = document.getElementsByClassName('ant-table-cell ant-table-column-has-sorters');

      const tableElements = document.getElementsByClassName('ant-table-cell ant-table-column-sort');


      userEvent.click(tableHeaderColumns.item(0));
    });

    it('filters data', () => {});
  });
});
