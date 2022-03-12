import React from 'react';
import { Layout, Button, Col, Row, List } from 'antd';
import { API_URL } from '../util';
import SearchBar from '../components/search-bar';
import downloadFileToClient from '../functions/downloadFileToClient';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [fileLinks, setFileLinks] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getFileLinks = async () => {
      const data = await (await fetch(`${API_URL}/list-files`)).json();
      setFileLinks(data);
    };
    getFileLinks();
  }, []);

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
        <Button type='link' key={link} onClick={() => downloadFile(link)}>
          {link}
        </Button>
      </List.Item>
    );
  };

  return (
    <>
      <Layout>
        <Layout.Content style={{ padding: '0 2vw' }}>
          <Row
            type='flex'
            justify='center'
            align='middle'
            style={{ minHeight: '100vh' }}
          >
            <Button
              type='default'
              shape='round'
              onClick={() => navigate('/admin')}
              style={{
                position: 'absolute',
                right: '1vh',
                top: '1vh',
              }}
            >
              Admin
            </Button>
            <Col
              md={12}
              span={24}
              offset={{ md: 6 }}
              type='flex'
              justify='center'
              align='middle'
              style={{ minHeight: '50vh' }}
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
