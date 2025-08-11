import React from 'react'
import reviews from "../data/reviews.js"
import ReviewCard from '../components/ReviewCard.jsx'

const Reviews = () => {
    return (
        <div>
            <div className=" text-2xl sm:text-4xl text-glow pb-10 ps-4 md:ms-10">
                Rating and Reviews
                <i class="fa-solid fa-arrow-right-long pt-1 ps-2"></i>
            </div>
            <div className="overflow-x-auto px-4 hide-scrollbar">

                <div className="flex gap-6 w-max lg:ms-10">
                    {reviews.map((user, index) => (
                        <div key={index} className="flex-shrink-0">
                            <ReviewCard
                                username={user.username}
                                image={user.image}
                                review={user.review}
                                rating={user.rating}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Reviews
