import React from 'react'
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

const ReviewCard = ({ username, image, review, rating }) => {
    return (
        <div className="card w-96 bg-base-100 card-md shadow-sm rounded-3xl">
            <div className="card-body">
                <div className="card-title text-3xl flex justify-between">
                    <i class="fa-solid fa-quote-left"></i>
                    <div tabIndex={0} role="button" className="btn btn-ghost h-12 w-12 rounded-full overflow-hidden p-0 border-yellow-500 border-2">
                        <img src={image} alt="Profile" className="h-full w-full object-cover" />
                    </div>
                </div>
                <p className='text-right text-[10px] pt-2'><span className='text-2xl pe-1'>{username}</span> SAYS</p>
                <p>{review}</p>
                <div className="justify-end card-actions pt-2">
                    <Box>
                        <Rating
                            name="custom-star"
                            value={rating}
                            precision={0.5}
                            readOnly
                            icon={<i className="fas fa-star text-theme"></i>}
                            emptyIcon={<i className="far fa-star text-gray-500"></i>}
                        />
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard;
