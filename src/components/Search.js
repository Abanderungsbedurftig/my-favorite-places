import React, {Component} from 'react'
import ListItem from './ListItem'
import SearchForm from './SearchForm'
import MapBox from 'mapbox'
import {mapToken, apiUrl, delUrl, host} from '../data/config'
import {getHttpRequest, postHttpRequest} from '../data/http'
import '../css/Search.css'

export default class Search extends Component{

    constructor(props){
        super(props)
        this.state = {
            myLocation: '',
            location: null,
            points: props.points,
            isPointSearch: false
        }
        this.checkGeolocation = this.checkGeolocation.bind(this)
        this.addPoint = this.addPoint.bind(this)
        this.deletePoint = this.deletePoint.bind(this)
        this.getPointsFromServer = this.getPointsFromServer.bind(this)
        this.addPoint = this.addPoint.bind(this)
        this.deletePoint = this.deletePoint.bind(this)
        this.showPosition = this.showPosition.bind(this)
        this.mapbox = new MapBox(mapToken)
    }

    componentWillReceiveProps(nextProps){
        if((nextProps.location && this.state.location && nextProps.location.name !== this.state.location.name) || (nextProps.location && !this.state.location)){
            const {lat, lng} = nextProps.location
            const latitude = lat
            const longitude= lng
            this.mapbox.geocodeReverse({latitude, longitude}, {})
                .then(loc => {
                    if(!loc.entity.features || !loc.entity.features.length) return
                    const name = loc.entity.features[0].place_name
                    const currentLoc = {lat , lng, name}
                    this.setState(() => ({location: currentLoc}))
                })
        }else if(!nextProps.location && this.state.location){
            this.setState(() => ({location: null}))
        }
        if(nextProps.points.size !== this.state.points.size){
            let points = new Set(nextProps.points)
            this.setState(() => ({points: points}))
        }
    }

    checkGeolocation(){
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(({coords}) => {
                const {latitude, longitude} = coords
                this.mapbox.geocodeReverse({latitude, longitude}, {})
                    .then(loc => {
                        if(!loc.entity.features || !loc.entity.features.length) return
                        const feature = loc.entity.features[0]
                        const [lng, lat] = feature.center
                        const currentLoc = {
                            name: feature.place_name,
                            lat,
                            lng
                        }
                        this.setState(() => ({myLocation: currentLoc}))
                        this.props.onShowMyPosition(currentLoc)
                        this.props.onCheckPoint(null)
                        this.getPointsFromServer(currentLoc)
                        
                    })
                },
                null,
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            )
        }
    }

    addPoint(point, txt, rating){
        let p = point
        p.description = txt
        p.rating = rating
        this.addPointToserver(p)
    }

    deletePoint(point){
        this.deletePointFromServer(point)
    }

    showPosition(loc){
        this.props.onCheckPoint(null)
        this.props.onShowMyPosition(loc)
        this.getPointsFromServer(loc)
    }

    getPointsFromServer(loc){
        getHttpRequest(`${host + apiUrl}?lng=${loc.lng}&lat=${loc.lat}`)
            .then(data => {
                this.props.onChangePoints(data)
            })
            .catch(err => this.props.onError(err.message))
    }

    addPointToserver(point){
        postHttpRequest(host + apiUrl, point)
            .then(data => this.props.onAddPoint(data.location))
            .catch(err => this.props.onError(err.message))
    }

    deletePointFromServer(point){
        postHttpRequest(host + delUrl, {id: point.id})
            .then(data => this.props.onDeletePoint(point))
            .catch(err => this.props.onError(err.message))
    }

    render(){
        return(
            <div className="search">
                <button className="input btn" onClick={this.checkGeolocation}><i className="fas fa-map-marker-alt"></i></button>  
                <SearchForm isSearch={true} mapbox={this.mapbox} location={null} onLocationSelect={(loc) => this.showPosition(loc)}/>
                {this.state.isPointSearch ? (<SearchForm isSearch={false} mapbox={this.mapbox} location={this.state.location} onLocationSelect={(loc, txt, rat) => this.addPoint(loc, txt, rat)}/>)
                : null}
                <div className="show-btn">
                    {this.state.isPointSearch ? <i className="fas fa-arrow-circle-up" onClick={() => this.setState(() => ({isPointSearch: false}))}></i> 
                        : <i className="fas fa-arrow-circle-down" onClick={() => this.setState(() => ({isPointSearch: true}))}></i>}
                </div>
                {this.state.points.size ? (
                    <div className="points" style={{height: this.state.isPointSearch ? '400px' : '660px'}}>
                        {Array.from(this.state.points).map((point, i) => (
                            <ListItem location={point} item={i+1} key={i} onDeletePoint={() => this.deletePoint(point)} onCheckPoint={() => this.props.onCheckPoint(point)}/>
                        ))}
                    </div>
                ) : null}
            </div>
        )
    }
}