import React, { useState } from "react";
import { db } from "../utils/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Notiflix from "notiflix";

// MUI Imports
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";

export default function ReviewModal() {
    const [rating, setRating] = useState(5.0); // decimal support
    const [hover, setHover] = useState(-1); // for hover label
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    const clearForm = () => {
        setRating(5.0);
        setHover(-1);
        setReview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "reviews"), {
                name: localStorage.getItem("name"),
                dp: localStorage.getItem("dp") ? localStorage.getItem("dp") : "/profile.png",
                rating: Number(rating.toFixed(1)), // store with 1 decimal
                review: review.trim(),
                createdAt: serverTimestamp(),
            });

            Notiflix.Notify.success("Review submitted successfully!");
            document.getElementById("review_modal").close();
            clearForm();
        } catch (error) {
            console.error("Error adding review: ", error);
            Notiflix.Notify.failure("Failed to submit review. Try again.");
        }

        setLoading(false);
    };

    return (
        <dialog id="review_modal" className="modal">
            <div className="modal-box custom-bg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-lg">Leave a Review</h3>
                    <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        type="button"
                        onClick={() => document.getElementById("review_modal").close()}
                    >
                        <i class="fa-solid fa-xmark text-theme fa-xl"></i>
                    </button>


                    {/* Rating (MUI Stars) */}
                    <fieldset className="fieldset border border-indigo-800 dark:border-yellow-500 p-4 rounded-box">
                        <legend className="fieldset-legend text-sm text-theme">Rating</legend>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Rating
                                name="hover-feedback"
                                value={rating}
                                precision={0.1}
                                icon={<i className="fas fa-star text-theme text-xl" />} // filled star
                                emptyIcon={<i className="fas fa-star text-gray-400 text-xl" />} // empty star
                                getLabelText={(value) =>
                                    `${value.toFixed(1)} Star${value !== 1 ? "s" : ""}`
                                }
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: '#facc15', // Tailwind yellow-400
                                    },
                                    '& .MuiRating-iconEmpty': {
                                        color: '#9ca3af', // Tailwind gray-400
                                    },
                                    '& .MuiRating-icon': {
                                        fontSize: '28px', // fixed size
                                    },
                                }}
                            />
                            <span>{hover !== -1 ? hover.toFixed(1) : rating.toFixed(1)}</span>
                        </Box>
                    </fieldset>

                    {/* Review Text */}
                    <fieldset className="fieldset border border-indigo-800 dark:border-yellow-500 p-4 rounded-box">
                        <legend className="fieldset-legend text-sm text-theme">Review</legend>
                        <textarea
                            placeholder="Write your review..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="textarea w-full"
                            required
                        ></textarea>
                    </fieldset>

                    {/* Actions */}
                    <div className="modal-action">
                        <button type="submit" className="btn custom-btn w-full" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
