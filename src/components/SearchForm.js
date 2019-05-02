import React, {Component} from 'react'
import Stars from './Stars'

export default class SearchForm extends Component{

    constructor(props){
        super(props)
        this.state = {
            locName: '',
            locations: [],
            selectedLoc: '',
            description: '',
            rating: 0
        }
        this.changeLocation = this.changeLocation.bind(this)
        this.updateLocation = this.updateLocation.bind(this)
        this.selectLocation = this.selectLocation.bind(this)
        this.updateDescription = this.updateDescription.bind(this)
        this.mapbox = props.mapbox
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location && nextProps.location.name !== this.state.locName){
            this.setState(() => ({
                locName: nextProps.location.name,
                selectedLoc: nextProps.location
            }))
        }else if(!nextProps.location && this.state.locName){
            this.setState(() => ({
                locName: '',
                selectedLoc: ''
            }))
        } 
    }

    selectLocation(){
        this.props.onLocationSelect(this.state.selectedLoc, this.state.description, this.state.rating)
        this.setState(() => ({locName: '', locations: [], description: '', rating: 0}))
    }

    updateLocation(location){
        this.setState(() => {
            return {
                locName: location.name,
                locations: [],
                selectedLoc: location,
                description: ''
            }
        })
        this.props.onLocationSelect(location, this.state.description, this.state.rating)
    }

    changeLocation(e){
        let locName = e.target.value
        this.setState(() => ({locName}))
        if(!locName) return
        this.mapbox.geocodeForward(locName, {})
            .then(loc => {
                if(!loc.entity.features || !loc.entity.features.length) return
                let locations = loc.entity.features.map(feature => {
                    const [lng, lat] = feature.center
                    return {
                        name: feature.place_name,
                        lat,
                        lng
                    }
                })
                let selectedLoc = locations[0]
                this.setState(() => ({locations, selectedLoc}))
            })
    }

    updateDescription(e){
        this.setState({description: e.target.value})
    }

    render(){
        const {isSearch} = this.props

        return[
            <div className="search-form" key="search_form">
                <input type="text" className="input txt" onChange={this.changeLocation} value={this.state.locName} placeholder={isSearch ? "Ваше местонахождение..." : "Выберете локацию..."}/>
                <button className="input btn" onClick={this.selectLocation} disabled={!this.state.locName}><i className={"fas " + (isSearch ? "fa-search" : "fa-heart")}></i></button> 
                {this.state.locName.length && this.state.locations.length ? (
                    <div className="locations">
                        {this.state.locations.map(location => {
                            return(
                                <div className="loc-search" onClick={e => {e.preventDefault(); this.updateLocation(location)}} key={location.name}>
                                    {location.name}
                                </div>
                            )
                        })}
                    </div>
                ) : <div></div>}
            </div>,
            isSearch ? <div key="empty_div"></div> : (
                <textarea key="textarea" className="loc-description" placeholder="Комментарий:" onChange={this.updateDescription} value={this.state.description}/>
            ),
            isSearch ? <div key="empty_star"></div> : (
                <Stars key="stars" rating={this.state.rating} st={"white"} onChangeRating={rating => this.setState(() => ({rating}))}/>
            )
        ]
    }
}