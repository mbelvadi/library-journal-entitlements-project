import React from 'react';
import { Layout, Button, Col, Row, List } from 'antd';
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

  const mapLinkToListItem = (link) => {
    return (
      <List.Item>
        <Button
          type='link'
          key={link}
          onClick={() => {
            downloadFile(link);
          }}
        >
          {link}
        </Button>
      </List.Item>
    );
  };

  return (
    <>
      <Layout>
        <Layout.Content>
          <Row
            type='flex'
            justify='center'
            align='middle'
            style={{ minHeight: '100vh', alignItems: 'center' }}
          >
            <Col
              span={8}
              type='flex'
              justify='center'
              align='middle'
              style={{ minHeight: '50vh', alignItems: 'center' }}
            >
              <img //TODO: replace with configurable logo
                src='https://pbs.twimg.com/profile_images/878250120587997184/siODyNVB_400x400.jpg'
                alt='university logo'
                style={{ width: 160 }}
              />
              <SearchBar />
              <List
              style={{ marginTop: '50px' }}
                header={<h3>Files Being Searched</h3>}
                bordered={true}
                dataSource={fileLinks}
                renderItem={mapLinkToListItem}
              ></List>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </>
  );
}
