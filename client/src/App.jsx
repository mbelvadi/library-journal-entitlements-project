import { Layout } from 'antd';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import NotFound from './pages/not-found';
import SearchResults from './pages/search-results';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <Layout.Content style={{ padding: '0 2vw' }}>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/search' element={<SearchResults />}></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </Layout.Content>
      </Layout>
    </BrowserRouter>
  );
}
