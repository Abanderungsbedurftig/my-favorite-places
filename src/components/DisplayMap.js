import React, {Component} from 'react'
import PointInfo from './PointInfo'
import Distance from './Distance'
import {mapToken} from '../data/config'
import {getDirection} from '../data/http'

export default class DisplayMap extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            mapLoaded: false,
            location: {
                lat: props.location.lat,
                lng: props.location.lng,
                name: props.location.name
            },
            points: props.points,
            showPoint: null,
            toPointDistance: null
        }
        this.ensureMapExists = this.ensureMapExists.bind(this)
        this.updateMapPosition = this.updateMapPosition.bind(this) 
        this.showPointInfo = this.showPointInfo.bind(this)   
        this.setDirection = this.setDirection.bind(this)
        this.removeRoute = this.removeRoute.bind(this)
    }

    componentDidMount(){
        this.L = window.L
        this.L.mapbox.accessToken = mapToken;
        this.mapNode.style.height = '100vh'
        if(this.state.location.lng && this.state.location.lat) this.ensureMapExists()
    }

    componentDidUpdate(){
        if(this.map) this.map.invalidateSize(false)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location){
            const locationAreEqual = Object.keys(nextProps.location).every(i => nextProps.location[i] === this.props.location[i])
            if(!locationAreEqual) this.updateMapPosition(nextProps.location)
        }
        if(nextProps.points.size !== this.state.points.size){
            let points = new Set(nextProps.points)
            this.setState(() => ({points: points}))
            for(let point of nextProps.points){
                if(this.marker && !this.marker.has(point.lat.toString() + point.lng.toString())) this.addMarker(point.lat, point.lng, point.id, this.findPosition(point, nextProps.points))  
                else if(!this.marker) this.addMarker(point.lat, point.lng, point.id, this.findPosition(point, nextProps.points)) 
            }
        }
        if(nextProps.removedPoint && this.marker){
            const key = nextProps.removedPoint.lat.toString() + nextProps.removedPoint.lng.toString()
            if(this.marker.has(key)){
                this.map.removeLayer(this.marker.get(key))
                this.marker.delete(key)
            }
        }
        if(nextProps.showPoint !== this.state.showPoint && nextProps.showPoint){
            this.setInfoPosition(nextProps.showPoint)
        }
        if(!nextProps.showPoint && this.state.showPoint){
            this.setState(() => ({showPoint: null}))
        }
    }

    setInfoPosition(point){
        const showPoint = point
        const img = document.querySelector(`img[title="${point.id}"]`)
        const coord = img.getBoundingClientRect()
        showPoint.position = {x: coord.right-15, y: coord.top+15}
        this.setState(() => ({showPoint}))
    }

    setDistancePosition(id, dist){
        const imgD = document.querySelector(`img[title="${id}"]`)
        const coordD = imgD.getBoundingClientRect()
        this.setState(() => ({toPointDistance: {distance: dist, left: coordD.left-20, top: coordD.top-34, id: id}}))
    }

    ensureMapExists(){
        if(this.state.mapLoaded) return
        this.map = this.L.mapbox.map(this.mapNode, 'mapbox.streets', {
            zoomControl: false
        }).addLayer(this.L.mapbox.styleLayer('mapbox://styles/nas363/cju86c81u1ckl1flfgjmlh9mj'));
        this.map.on('click', e => this.clickLocation(e))
        this.map.on('move', () => this.replaceInfo())
        this.map.setView(this.L.latLng(this.state.location.lat, this.state.location.lng), 15)
        this.setState(() => ({mapLoaded: true}))
    }

    clickLocation(e){
        const loc = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            name: 'noname'
        }
        this.props.onClickLocation(loc)  
    }

    replaceInfo(){  
        if(this.state.showPoint){
            const point = this.state.showPoint
            this.setInfoPosition(point)
        } 
        if(this.state.toPointDistance){
            this.setDistancePosition(this.state.toPointDistance.id, this.state.toPointDistance.distance)
        } 
    }

    updateMapPosition(location){
        const {lat, lng} = location
        this.map.setView(this.L.latLng(lat, lng))
        this.addMyPosition(lat, lng)
        this.setState(() => ({location}))
    }

    addMarker(lat, lng, id, pos){
        if(!this.marker) this.marker = new Map()
        let marker = this.L.marker([lat, lng], {
            icon: this.L.mapbox.marker.icon({
                'marker-color': '#4469af',
                'marker-symbol': (pos+1).toString()
            }),
            riseOnHover: true,
            title: id
        })
        marker.addTo(this.map)
        this.marker.set(lat.toString() + lng.toString(), marker)
        const img = document.querySelector(`img[title="${id}"]`)
        img.addEventListener('click', e => this.showPointInfo(e))
    }

    findPosition(point, points){
        const array = Array.from(points)
        const pos = array.indexOf(point)
        return pos
    }

    setDirection(pointB){
        if(!this.polyline) this.polyline = this.L.polyline([]).addTo(this.map)
        let waypoints = [this.state.location, pointB]
        waypoints = waypoints.map(point => [point.lng, point.lat].join(',')).join(';')
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${waypoints}?geometries=geojson&access_token=${this.L.mapbox.accessToken}`
        getDirection(directionsUrl)
            .then(data => {
                const distance = data.routes[0].distance
                let route = data.routes[0].geometry.coordinates
                route = route.map(point => ([point[1], point[0]]))
                route.push([pointB.lat, pointB.lng])
                route.unshift([this.state.location.lat, this.state.location.lng])
                this.polyline.setLatLngs(route);
                this.showDistance(this.state.showPoint, distance)
            })
            .catch(err => this.props.onError(err.message))
    }

    showDistance(point, distance){
        if(point){
            let dist
            if(distance > 1000) dist = (distance/1000).toFixed(2).toString() + ' км'
            else dist = parseInt(distance).toString() + ' м'
            this.setDistancePosition(point.id, dist)
        }
    }

    showPointInfo(e){
        const points = Array.from(this.state.points)
        let point = points.filter(p => p.id === e.target.title)[0]
        point.position = {x: e.x, y: e.y}
        this.props.onSetShowPoint(point)
    }

    addMyPosition(lat, lng){
        if(this.myPosition) return this.myPosition.setLatLng(this.L.latLng(lat, lng))
        this.myPosition = this.L.marker([lat, lng], {
            icon: this.L.mapbox.marker.icon({
                'marker-color': '#db2932'
            })
        })
        this.myPosition.addTo(this.map)
    }

    removeRoute(){
        this.props.onSetShowPoint(null)
        this.setState(() => ({toPointDistance: null}))
        this.L.polyline([]).addTo(this.map)
        this.polyline.setLatLngs([]);
    }

    render(){
        return (
            <div key="displayMap" className="display-map">
                <div className="map" ref={node => this.mapNode = node} style={{cursor: "pointer"}}>
                    {this.state.toPointDistance ? <Distance distance={this.state.toPointDistance} onCloseRoute={() => this.removeRoute()}/> : <div></div>}
                    {this.state.showPoint && this.state.showPoint.position.x && this.state.showPoint.position.y 
                        ? <PointInfo point={this.state.showPoint} onCloseInfo={() => this.setState(() => ({showPoint: null}))} onSetRoute={point => this.setDirection(point)}/> 
                        : <div></div>}
                </div>
            </div>
        )
    }
}