import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { API_URL } from '../util';
import DataTable from '../components/data-table';
import Header from '../components/header';


const parseParams = (querystring) => {
  const params = new URLSearchParams(querystring);
  const obj = {};
  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key);
    }
  }
  return obj;
};

export default function SearchResults() {
  const [searchResults, setSearchResults] = React.useState(null);
  const search = useLocation().search;
  const searchParams = parseParams(search);

  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchParams.query) return;
      const res = await (
        await fetch(`${API_URL}/search`, {
          method: 'POST',
          body: JSON.stringify(searchParams),
        })
      ).json();
      setSearchResults(res);
    };
    fetchSearchResults().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <Layout>
        <Header />
        <Layout.Content style={{ padding: '0 2vw' }}>
          <h1>
            Search Results{' '}
            {searchParams?.query ? (
              <>
                for <i>{searchParams.query}</i>
              </>
            ) : (
              ''
            )}
          </h1>
          <div>
            <DataTable data={searchResults} />
          </div>
        </Layout.Content>
      </Layout>
    </>
  );
}
