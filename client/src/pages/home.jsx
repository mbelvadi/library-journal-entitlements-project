import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [randomNumber, setRandomNumber] = React.useState(null);

  const getRandomNumber = async () => {
    const res = await fetch(
      'http://localhost/upei-library-journal-project/server/routes/random-number'
    );
    const data = await res.json();
    setRandomNumber(data.randomNumber);
  };

  return (
    <>
      <h1>Home</h1>
      <Link to='/search'>Search</Link>
      <br />
      <Button type='primary' onClick={getRandomNumber}>
        Get Random Number
      </Button>
      <div>Random number: {randomNumber}</div>
    </>
  );
}
