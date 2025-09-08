import React from 'react';
import { StarIcon, StarHalfIcon } from './icons/index.jsx';

const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} />)}
      {halfStar && <StarHalfIcon key="half" />}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="text-gray-600" />)}
    </div>
  );
};

export default Rating;
