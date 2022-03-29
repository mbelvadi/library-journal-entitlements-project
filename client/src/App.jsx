import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Admin from './pages/admin';
import Home from './pages/home';
import NotFound from './pages/not-found';
import SearchResults from './pages/search-results';
import { API_URL } from './util';
import StyleContext from './util/styleContext';
import { changeAntdTheme } from 'dynamic-antd-theme';

export default function App() {
  const [styleConfig, setStyleConfig] = React.useState(null);

  React.useEffect(() => {
    const getStyleConfig = async () => {
      try {
        const style = await (await fetch(`${API_URL}/style`)).json();
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
    getStyleConfig();
  }, []);

  return (
    <StyleContext.Provider value={styleConfig}>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/search' element={<SearchResults />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </HashRouter>
    </StyleContext.Provider>
  );
}
