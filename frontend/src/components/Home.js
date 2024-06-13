import React from 'react';
import { Link } from 'react-router-dom';
import CuratorList from './CuratorList'; // Подключаем компонент CuratorList

function Home() {
  return (
    <div className="container">
      <h2 className="heading">Home</h2>
      <p>Welcome to the Curator Ratings App!</p>
      <p>
        Here you can see a list of curators and their average ratings.
        Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to leave a review.
      </p>
      <CuratorList /> {/* Выводим список кураторов */}
    </div>
  );
}

export default Home;
