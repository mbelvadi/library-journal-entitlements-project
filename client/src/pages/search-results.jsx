import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { API_URL } from '../util';
import DataTable from '../components/data-table';
import Header from '../components/header';
import downloadFileToClient from '../functions/downloadFileToClient';

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
  const [displayedData, setDisplayedData] = React.useState([]);
  const search = useLocation().search;
  const searchParams = parseParams(search);

  const onClickDownload = () => {
    const resultsToExport = displayedData.map(
      ({ key, ...keepAttrs }) => keepAttrs
    );
    const replacer = (key, value) => (value === null ? '' : value); //TODO: how to handle nulls?
    const delimeter = '\t'; //TODO: can easily change to CSV or add as an option
    const fileExtension = 'tsv';
    const header = Object.keys(resultsToExport[0]);
    let tsv = [
      header.join(delimeter),
      ...resultsToExport.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(delimeter)
      ),
    ]
      .join('\r\n')
      .replaceAll('"', '');

    downloadFileToClient(
      new Blob([tsv], { type: 'text/' + fileExtension }),
      'report.' + fileExtension
    ); //TODO: come up with a useful filename template
  };

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
      setDisplayedData(res.results);
    };
    fetchSearchResults().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [search]);

  return (
    <>
      <Layout>
        <Header onClickDownload={onClickDownload}/>
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
            <DataTable
              data={searchResults}
              setDisplayedData={setDisplayedData}
            />
          </div>
        </Layout.Content>
      </Layout>
    </>
  );
}
