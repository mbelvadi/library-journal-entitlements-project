import React from 'react';
import { Layout, Button, Col, Row, List } from 'antd';
import { API_URL } from '../util';
import SearchBar from '../components/search-bar';
import { downloadFileToClient } from '../util';
import StyleContext from '../util/styleContext';
import AdminButton from '../components/buttons/admin';
import HelpButton from '../components/buttons/help';

export default function Home() {
  const [fileLinks, setFileLinks] = React.useState([]);
  const styleConfig = React.useContext(StyleContext);

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
            style={{
              minHeight: '100vh',
              paddingTop: '100px',
              paddingBottom: '100px',
            }}
          >
            <AdminButton
              style={{
                position: 'absolute',
                right: '100px',
                top: '10px',
              }}
            />
            <HelpButton
              style={{
                position: 'absolute',
                right: '10px',
                top: '10px',
              }}
            />
            <Col
              md={12}
              span={24}
              offset={{ md: 6 }}
              type='flex'
              justify='center'
              align='middle'
              style={{ minHeight: '50vh' }}
            >
              <img
                src={styleConfig?.logo}
                alt='university logo'
                style={{ width: 160 }}
              />
              <SearchBar />
              <List
                style={{ marginTop: '50px', maxWidth: '700px' }}
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
