import fetch from 'isomorphic-fetch'

export const getHttpRequest = address => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: new Headers(),
            mode: 'cors'
        }
        fetch(address, options)
            .then(res => {
                if(res.status === 200) resolve(res.json())
                else return res.json()
            })
            .then(json => reject(json))
    })
}

export const postHttpRequest = (address, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(data),
            mode: 'cors'
        }
        fetch(address, options)
            .then(res => {
                if(res.status === 200) resolve(res.json())
                else return res.json()
            })
            .then(json => reject(json))
    })
}

export const getDirection = address => {
    return new Promise((resolve, reject) => {
        fetch(address)
            .then(res => {
                if(res.status === 200) resolve(res.json())
                else return res.json()
            })
            .then(json => reject(json))
    })
}