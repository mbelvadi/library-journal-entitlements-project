import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
        await fetch(
          'http://localhost/upei-library-journal-project/server/routes/search',
          {
            method: 'POST',
            body: JSON.stringify(searchParams),
          }
        )
      ).json();
      setSearchResults(res);
    };
    fetchSearchResults().catch(console.error);
  }, [search]);

  return (
    <>
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
      <div>{JSON.stringify(searchResults)}</div>
    </>
  );
}
