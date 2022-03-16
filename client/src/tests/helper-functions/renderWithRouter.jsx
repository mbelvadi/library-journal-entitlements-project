import React from 'react';
import { Router } from 'react-router-dom';


import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

export default function renderWithRouter(
  route,
  component,
  testId,
  defaultFunc,
  rerenderFunc
) {
  const history = createMemoryHistory({ initialEntries: [route] });

  const finalComponent = (
    <Router location={history.location} navigator={history}>
      <div data-testid={testId}>{component}</div>
    </Router>
  );

  let rerender = () => {};

  if (rerenderFunc) {
    rerenderFunc(finalComponent);
  } else {
    rerender = render(finalComponent).rerender;
    defaultFunc(history);
  }

  return {
    rerender: rerender,
    component: finalComponent,
  };
}
