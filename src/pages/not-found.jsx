import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p>Sorry it looks like that page doesn't exist</p>
      <Link to='/'>Home</Link>
      <Link to='/search'>Search</Link>
    </>
  );
}
