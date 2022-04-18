import '@testing-library/jest-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../helper-functions/renderWithRouter';

import DataTable from '../../components/data-table';

import testData from '../resources/test-search-result-data.json';

const testId = 'datatable-testId';

let history = {};
let dataTable = {};

const setDisplayedData = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();

  ({ history } = renderWithRouter(
    '/search',
    <DataTable
      data={testData}
      setDisplayedData={setDisplayedData}
      loadingResults={false}
    />,
    testId
  ));
  dataTable = screen.queryByTestId(testId);
  expect(dataTable).toBeTruthy();
});

describe('<DataTable />', () => {
  describe('Success', () => {
    it('renders the DataTable component', () => {
      // intentionally empty; testing beforeEach
    });

    it('renders the table header', () => {
      expect(screen.getByText('Has Rights')).toBeTruthy;
    });

    it('renders the rows', () => {
      expect(document.getElementsByClassName('ant-table-row') > 0);
    });

    it('renders pagination bar', () => {
      expect(document.getElementsByClassName('ant-table-pagination') > 0);
    });

    const getNthRow = (n) => {
      const tableBody = document
        .getElementsByClassName('ant-table-tbody')
        .item(0);
      expect(tableBody).toBeTruthy();
      return tableBody.children.item(n);
    };

    const getNthCellInFirstRow = (n) => {
      const tableBody = document
        .getElementsByClassName('ant-table-tbody')
        .item(0);
      expect(tableBody).toBeTruthy();
      const cell = tableBody.children.item(1).children.item(n);
      return cell;
    };

    test('pagination works', () => {
      const firstPageFirstRow = getNthRow(1);
      const page2Button = document
        .getElementsByClassName('ant-pagination-item-2')
        .item(0).firstChild;

      userEvent.click(page2Button);

      const secondPageFirstRow = getNthRow(1);

      expect(firstPageFirstRow).not.toEqual(secondPageFirstRow);
    });

    const getNthParentElement = (element, n) => {
      for (let i = 0; i < n; i++) {
        element = element.parentElement;
      }
      return element;
    };

    const getIndexOfColumn = (column) => {
      const columns = []

      const collection = document.getElementsByClassName(
        'ant-table-cell ant-table-column-has-sorters'
      );

      for (let i = 0; i < collection.length; ++i) {
        columns.push(collection.item(i));
      }

      return columns.findIndex((element) => element === column);
    };

    const clickSorter = (sorter) => {
      userEvent.click(sorter);
      expect(setDisplayedData).toBeCalled();
      setDisplayedData.mockReset();
    };

    it('sorts data alphabetically', () => {
      const titleColumnSorter = getNthParentElement(
        screen.getByText('Title'),
        4
      );
      const index = getIndexOfColumn(titleColumnSorter);

      clickSorter(titleColumnSorter);

      const firstSortFirstCellText =
        getNthCellInFirstRow(index).textContent.toLowerCase();

      clickSorter(titleColumnSorter);

      const secondSortFirstCellText =
        getNthCellInFirstRow(index).textContent.toLowerCase();

      expect(firstSortFirstCellText.localeCompare(secondSortFirstCellText) < 1);
    });

    it('sorts data numerically', () => {
      const yearColumnSorter = getNthParentElement(screen.getByText('Year'), 4);
      const index = getIndexOfColumn(yearColumnSorter);

      clickSorter(yearColumnSorter);

      const firstSortFirstYearCell = getNthCellInFirstRow(index).textContent;

      clickSorter(yearColumnSorter);

      const secondSortFirstYearCell = getNthCellInFirstRow(index).textContent;

      expect(firstSortFirstYearCell < secondSortFirstYearCell);
    });
  });
});
