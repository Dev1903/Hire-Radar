import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase.js"; // your firebase config file
import ReviewCard from '../components/ReviewCard.jsx';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "reviews"));
                const fetchedReviews = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(fetchedReviews)
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div>
            <div className="text-2xl sm:text-4xl text-glow pb-10 ps-4 md:ms-10">
                Rating and Reviews
                <i className="fa-solid fa-arrow-right-long pt-1 ps-2"></i>
            </div>

            <div className="overflow-x-auto px-4 hide-scrollbar">
                <div className="flex gap-6 w-max lg:ms-10">
                    {reviews.map((user) => (
                        <div key={user.id} className="flex-shrink-0">
                            <ReviewCard
                                username={user.name}
                                image={user.dp}
                                review={user.review}
                                rating={user.rating}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
