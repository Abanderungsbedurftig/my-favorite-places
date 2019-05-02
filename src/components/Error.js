import React from 'react'
import '../css/Error.css'

const ErrorWindow = ({message, onClick=f=>f}) => {
    return (
        <div className="error-window">
            <span>{message}</span>
            <button className="error-btn" onClick={() => onClick()}>OK</button>
        </div>
    )
}

export default ErrorWindow