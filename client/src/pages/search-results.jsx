import React from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Layout } from 'antd';
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
  const [loadingResults, setLoadingResults] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const search = useLocation().search;
  const searchParams = parseParams(search);
  const { apiRoute } = React.useContext(AppContext);

  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchParams.query) return;
      try {
        setError(undefined);
        setLoadingResults(true);
        const res = await (
          await fetch(`${apiRoute}/search`, {
            method: 'POST',
            body: JSON.stringify(searchParams),
          })
        ).json();
        setLoadingResults(false);
        setSearchResults(res);
        setDisplayedData(res.results);
      } catch (error) {
        setLoadingResults(false);
        setSearchResults(null);
        setDisplayedData([]);
        setError(
          'An unexpected error occured. This could be due to the search requiring more server memory than is currently allocated to PHP. Create a more narrow search or contact your system administrator for help.'
        );
        console.error(error);
      }
    };
    if (apiRoute) fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, apiRoute]);

  const generateExportFileContent = (delimeter, unwantedColumns) => {
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
        delete row[prop];
      }

      return row;
    });

    const header = Object.keys(resultsToExport[0]).join(delimeter);

    const values = resultsToExport
      .map((row) => Object.values(row).join(delimeter))
      .join('\n');

    return header + '\n' + values;
  }

  const onClickDownload = () => {
    const unwantedColumns = ['key', 'created_at', 'id'];
    const delimeter = '\t';
    const fileExtension = 'tsv';

    const fileContent = generateExportFileContent(delimeter, unwantedColumns);

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
          {error && (
            <Alert
              type='error'
              message={error}
              showIcon
              style={{ marginBottom: '10px' }}
            />
          )}
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
