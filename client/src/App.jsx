import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Admin from './pages/admin';
import Home from './pages/home';
import NotFound from './pages/not-found';
import SearchResults from './pages/search-results';
import AppContext from './util/styleContext';
import { changeAntdTheme } from 'dynamic-antd-theme';

export default function App() {
  const [styleConfig, setStyleConfig] = React.useState(null);
  const [appRoute, setAppRoute] = React.useState(null);

  React.useEffect(() => {
    const getConfig = async () => {
      const data = await (await fetch('./root.json')).json();
      const envAppRoute =
        process.env.NODE_ENV === 'development'
          ? `http://localhost/upei-library-journal-project/server/routes`
          : `${data.appRoute}/routes`;
      setAppRoute(envAppRoute);

      try {
        const style = await (await fetch(`${envAppRoute}/style`)).json();
        document.title = style.pageTitle;
        const favicon = document.getElementById('favicon');
        favicon.href = style?.favicon;
        setStyleConfig(style);

        if (style.color) {
          changeAntdTheme(style.color);
        }
      } catch (error) {
        console.error('Failed to set styling configuration values');
      }
    };
    getConfig();
  }, []);

  return (
    <AppContext.Provider value={{ apiRoute: appRoute, style: styleConfig }}>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/search' element={<SearchResults />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}
