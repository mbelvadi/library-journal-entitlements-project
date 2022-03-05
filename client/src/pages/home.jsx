import React from 'react';
import { Layout, Button } from 'antd';
import { API_URL } from '../util';
import SearchBar from '../components/search-bar';

export default function Home() {
  const [fileLinks, setFileLinks] = React.useState([]);

  React.useEffect(() => {
    const getFileLinks = async () => {
      const data = await (await fetch(`${API_URL}/list-files`)).json();
      setFileLinks(data);
    };
    getFileLinks();
  }, []);

  function downloadFileToClient(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  const downloadFile = async (file) => {
    const res = await fetch(`${API_URL}/download-local-file`, {
      method: 'POST',
      body: JSON.stringify({
        file: file,
      }),
    });
    res.blob().then((blob) => downloadFileToClient(blob, file));
  };

  const fileLinkElements = fileLinks.map((link) => {
    return (
      <Button
        type='link'
        key={link}
        onClick={() => {
          downloadFile(link);
        }}
      >
        {link}
      </Button>
    );
  });

  return (
    <>
      <Layout>
        <Layout.Content style={{ padding: '0 2vw' }}>
      <h1>Home</h1>
          <div>{fileLinkElements}</div>
        </Layout.Content>
      </Layout>
    </>
  );
}
