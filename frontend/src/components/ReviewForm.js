import React, { useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';

function ReviewForm({ curatorId, onClose, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/curators/${curatorId}/reviews`, {
        rating,
        comment,
      });
      console.log('Review submitted:', response.data);

      const updatedRating = response.data.newAverageRating;
      onReviewSubmit(curatorId, updatedRating);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review');
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form className="form review-form" onSubmit={handleSubmit}>
      <h2 className="heading">Leave a Review</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="rating">Rating:</label>
        <ReactStars
          count={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
          size={24}
          color2={'#ffd700'}
        />
      </div>
      <div className="form-group">
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
          required
        ></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
