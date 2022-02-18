import { Button } from 'antd';
import React from 'react';

export default function Home() {
  const [randomNumber, setRandomNumber] = React.useState(null);
  const [fileLinks, setFileLinks] = React.useState([]);

  React.useEffect(() => {
    const getFileLinks = async () => {
      const data = await (
        await fetch(
          'http://localhost/upei-library-journal-project/server/routes/list-files'
        )
      ).json();
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
    const res = await fetch(
      'http://localhost/upei-library-journal-project/server/routes/download-local-file',
      {
        method: 'POST',
        body: JSON.stringify({
          file: file,
        }),
      }
    );
    res.blob().then((blob) => downloadFileToClient(blob, file));
  };

  const getRandomNumber = async () => {
    const res = await fetch(
      'http://localhost/upei-library-journal-project/server/routes/random-number'
    );
    const data = await res.json();
    setRandomNumber(data.randomNumber);
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
      <h1>Home</h1>
      <div>{fileLinkElements}</div>
      <Button type='primary' onClick={getRandomNumber}>
        Get Random Number
      </Button>
      <div>Random number: {randomNumber}</div>
    </>
  );
}
