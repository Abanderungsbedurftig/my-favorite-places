import React from 'react'
import Stars from './Stars'
import '../css/PointInfo.css'

const PointInfo = ({point, onCloseInfo=f=>f, onSetRoute=f=>f}) => {

    const divStyle = {
        top: point.position.y + 'px',
        left: (point.position.x + 12) + 'px',
    }

    return(
        <div className="point-info" style={divStyle}>
            <span className="title-info">{point.name}</span>
            <div className="text-info">
                {point.description}
            </div>
            <Stars rating={point.rating} st={"gold"}/>
            <span className="close-info" onClick={() => onCloseInfo()}><i className="fas fa-times"></i></span>
            <span className="to-direction" onClick={() => onSetRoute(point)}><i className="fas fa-route"></i></span>
        </div>
    )
}

export default PointInfo