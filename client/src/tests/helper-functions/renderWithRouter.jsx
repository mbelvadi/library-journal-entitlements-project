import { Router } from 'react-router-dom';

import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

function getWrapperComponent(history, component, testId) {
  return (
    <Router location={history.location} navigator={history}>
      <div data-testid={testId}>{component}</div>
    </Router>
  );
}

export function renderWithRouter(route, component, testId) {
  let history = createMemoryHistory({ initialEntries: [route] });

  return {
    history: history,
    rerenderHook: render(getWrapperComponent(history, component, testId))
      .rerender,
  };
}

export function rerenderWithRouter(history, component, testId, rerenderHook) {
  return rerenderHook(getWrapperComponent(history, component, testId));
}
