import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';

function CuratorList() {
  const [curators, setCurators] = useState([]);
  const [selectedCurator, setSelectedCurator] = useState(null);

  useEffect(() => {
    const fetchCurators = async () => {
      try {
        const response = await axios.get('http://localhost:3001/curators');
        setCurators(response.data);
      } catch (error) {
        console.error('Error fetching curators:', error);
      }
    };

    fetchCurators();
  }, []);

  const handleReviewSubmit = (curatorId, updatedRating) => {
    setCurators((prevCurators) =>
      prevCurators.map((curator) =>
        curator.id === curatorId ? { ...curator, average_rating: updatedRating } : curator
      )
    );
    setSelectedCurator(null);
  };

  return (
    <div className="container">
      <h2 className="heading">Curators</h2>
      <div className="curator-list">
        {curators.map((curator) => (
          <div key={curator.id} className="curator-item">
            <h3 className="curator-name">{curator.name}</h3>
            <p className="curator-rating">Average Rating: {curator.average_rating}</p>
            <button className="review-button" onClick={() => setSelectedCurator(curator.id)}>
              Leave a Review
            </button>
          </div>
        ))}
      </div>
      {selectedCurator && (
        <ReviewForm
          curatorId={selectedCurator}
          onClose={() => setSelectedCurator(null)}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}

export default CuratorList;
