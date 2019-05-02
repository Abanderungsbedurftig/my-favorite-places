import React from 'react'
import '../css/ListItem.css'

const ListItem = ({location, item, onDeletePoint=f=>f, onCheckPoint=f=>f}) => {

    const deleteLocation = e => {
        e.stopPropagation()
        onDeletePoint()
    }

    const checkPoint = () => onCheckPoint()

    return(
        <div className="list-item" onClick={checkPoint}>
            {item + '. ' + location.name}
            <span className="delete-item" onClick={e => deleteLocation(e)}><i className="fas fa-times"></i></span>
        </div>
    )
}

export default ListItem