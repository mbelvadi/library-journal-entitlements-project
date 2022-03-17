import React from 'react';

import '@testing-library/jest-dom';
import { screen, fireEvent, act } from '@testing-library/react';
import renderWithRouter from '../helper-functions/renderWithRouter';

import DataTable from '../../components/data-table';

let history = {};
let dataTable = {};

beforeEach(() => {
  renderDataTable();
  dataTable = screen.queryByTestId('datatable');
  expect(dataTable).toBeTruthy();
});

const renderDataTable = () => {
  return renderWithRouter(
    '/search',
    <DataTable />,
    'datatable',
    (historyLocal) => {
      history = historyLocal;
    }
  );
};

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

    it('adds filter years as URL parameters', () => {});
  });
});
