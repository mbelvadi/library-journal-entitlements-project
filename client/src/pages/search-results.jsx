import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import DataTable from '../components/data-table';
import Header from '../components/header';
import { downloadFileToClient } from '../util';
import AppContext from '../util/appContext';

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
  const [loadingResults, setLoadingResults] = React.useState(true);
  const search = useLocation().search;
  const searchParams = parseParams(search);
  const { apiRoute } = React.useContext(AppContext);

  React.useEffect(() => {
    setLoadingResults(true);
    const fetchSearchResults = async () => {
      if (!searchParams.query) return;
      const res = await (
        await fetch(`${apiRoute}/search`, {
          method: 'POST',
          body: JSON.stringify(searchParams),
        })
      ).json();
      setSearchResults(res);
      setDisplayedData(res.results);
      setLoadingResults(false);
    };
    if (apiRoute) fetchSearchResults().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, apiRoute]);

  const onClickDownload = () => {
    const unwantedColumns = ['key', 'created_at'];
    const delimeter = '\t';
    const fileExtension = 'tsv';

    const resultsToExport = displayedData.map((row) => {
      for (const [oldKey, oldValue] of Object.entries(row)) {
        const key = oldKey.trim();
        row[oldKey] = undefined;

        if (key.toLowerCase() === 'is_crkn_record') {
          row[key] = oldValue ? 'Y' : 'N';
          continue;
        }

        if (typeof oldValue === 'string') {
          // trim out white space
          row[key] = oldValue.trim();
        } else if (oldValue === null || oldValue === undefined) {
          // convert empty entries to empty strings
          row[key] = '';
        } else {
          row[key] = oldValue;
        }
      }

      // remove unwanted columns from each row
      for (const prop of unwantedColumns) {
        row[prop] = undefined;
      }

      return row;
    });

    // remove unwanted columns that were undefined from header of columns
    const firstRow = resultsToExport[0];
    Object.keys(resultsToExport[0]).forEach(
      (key) => firstRow[key] === undefined && delete firstRow[key]
    );
    const header = Object.keys(firstRow).join(delimeter);

    const values = resultsToExport
      .map((row) => Object.values(row).join(delimeter))
      .join('\n');

    const fileContent = header + '\n' + values;

    downloadFileToClient(
      new Blob([fileContent], { type: 'text/' + fileExtension }),
      'LJEP-PAR-Report-' +
        new Date().toISOString().substring(0, 19) +
        'Z.' +
        fileExtension
    );
  };

  return (
    <>
      <Layout>
        <Header onClickDownload={onClickDownload} query={searchParams.query} />
        <Layout.Content style={{ padding: '20px 2vw' }}>
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
              loadingResults={loadingResults}
            />
          </div>
        </Layout.Content>
      </Layout>
    </>
  );
}
