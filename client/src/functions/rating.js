import React from 'react';
import StarRatings from 'react-star-ratings';

export const showAverage = (product) => {
    if (product && product.rating) {
        let ratingArray = product && product.rating
        let total = [];
        let length = ratingArray.length;

        ratingArray.map((r) => total.push(r.star));
        let totalReduced = total.reduce((p, n) => p + n, 0);
        let highest = length * 5;
        let result = (totalReduced * 5) / highest;

        return (
            <div className="text-center pt-1 pb-3">
                <span>
                    <StarRatings
                        rating={result}
                        starRatedColor="red"
                    />
                </span>
            </div>
        )
    }
}

export default showAverage;