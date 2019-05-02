import React from 'react'

const Stars = ({rating, st, onChangeRating=f=>f}) => {

    const stars = [rating > 0, rating > 1, rating > 2, rating > 3, rating > 4]

    const selectStar = rating => {
        onChangeRating(rating)
    }

    return(
        <div className={st + "-stars"}>
            {stars.map((star, i) => (
                star ? <i key={i} className={st + "-star fas fa-star"} onClick={() => selectStar(i+1)}></i> : <i key={i} className={st + "-star far fa-star"} onClick={() => selectStar(i+1)}></i>
            ))}
        </div>
    )
}

export default Stars