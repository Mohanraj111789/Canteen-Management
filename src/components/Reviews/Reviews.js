import React, { useState, useEffect } from 'react';
import { ref, push, get, set } from 'firebase/database';
import { database } from '../../firebase';
import { FaStar } from 'react-icons/fa';
import './Reviews.css';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    if (!productId) return;

    try {
      setError('');
      const reviewsRef = ref(database, `reviews/${productId}`);
      const snapshot = await get(reviewsRef);
      
      if (snapshot.exists()) {
        const reviewsData = Object.values(snapshot.val());
        setReviews(reviewsData.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!productId) {
      setError('Invalid product reference');
      return;
    }
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setIsSubmitting(true);

      // Create a reference to the specific product's reviews
      const reviewsRef = ref(database, `reviews/${productId}`);
      const newReview = {
        userName: userName.trim(),
        rating,
        timestamp: Date.now()
      };

      // Push the new review and get the reference
      const newReviewRef = await push(reviewsRef);
      
      // Set the data at the new review reference
      await set(newReviewRef, {
        id: newReviewRef.key,
        ...newReview
      });

      setSuccess('Thank you for rating this product! Your review has been submitted successfully.');
      setUserName('');
      setRating(0);
      setHover(0);
      await loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, hover, onRate, onHover }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index} className="star-label">
              <input
                type="radio"
                name="rating"
                className="star-input"
                value={ratingValue}
                onClick={() => onRate(ratingValue)}
              />
              <FaStar
                className="star"
                color={ratingValue <= (hover || value) ? "#ffc107" : "#e4e5e9"}
                size={25}
                onMouseEnter={() => onHover(ratingValue)}
                onMouseLeave={() => onHover(value)}
              />
            </label>
          );
        })}
      </div>
    );
  };

  if (!productId) {
    return <div className="text-center">Invalid product reference</div>;
  }

  return (
    <div className="reviews-container">
      <h4 className="mb-4">Customer Reviews</h4>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmitReview} className="review-form mb-4">
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
            disabled={isSubmitting}
            maxLength={50}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Your Rating</label>
          <StarRating
            value={rating}
            hover={hover}
            onRate={setRating}
            onHover={setHover}
          />
          {rating > 0 && (
            <small className="text-muted d-block mt-1">
              You selected {rating} star{rating !== 1 ? 's' : ''}
            </small>
          )}
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting || !userName.trim() || !rating}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="text-muted text-center">No reviews yet. Be the first to review!</p>
        ) : (
          <>
            <div className="mb-3">
              <strong>{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</strong>
            </div>
            {reviews.map((review) => (
              <div key={review.id || review.timestamp} className="review-item">
                <div className="review-header">
                  <div className="user-info">
                    <span className="user-name">{review.userName}</span>
                    <div className="rating-display">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="star-small"
                          color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                  <small className="text-muted">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews; 