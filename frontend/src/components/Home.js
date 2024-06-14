import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CuratorList from './CuratorList';
import Logout from './logout';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Home</h2>
      <p>Welcome to the Curator Ratings App!</p>
      {isAuthenticated ? (
        <p>
          You are logged in. Feel free to leave a review.
          <Logout />
        </p>
      ) : (
        <p>
          Here you can see a list of curators and their average ratings.
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to leave a review.
        </p>
      )}
      <CuratorList />
    </div>
  );
}

export default Home;
