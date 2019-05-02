import React from 'react'
import '../css/Distance.css'

const Distance = ({distance, onCloseRoute=f=>f}) => {

    const closeRoute = e => {
        e.stopPropagation()
        onCloseRoute()
    }

    return(
        <div className="distance" style={{top: distance.top, left: distance.left}}>
            {distance.distance}
            <div className="close-distance"><i className="fas fa-times" onClick={e => closeRoute(e)}></i></div>
        </div>
    )
}

export default Distance