import React, { Component } from 'react';
import DisplayMap from './DisplayMap'
import Search from './Search'
import Error from './Error'
import '../css/App.css';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      location: {
        lat: 55.753848,
        lng: 37.619936,
        name: 'Москва'
      },
      points: new Set(),
      showPoint: null,
      findLocation: null,
      removedPoint: null,
      error: null
    }
    this.setLocation = this.setLocation.bind(this)
    this.setPoints = this.setPoints.bind(this)
    this.setFindLocation = this.setFindLocation.bind(this)
    this.addPoint = this.addPoint.bind(this)
    this.deletePoint = this.deletePoint.bind(this)
  }

  setLocation(location){
    this.setState(() => ({location}))
  }

  setPoints(points){
    this.setState(() => ({points: new Set(points), findLocation: null}))
  }

  addPoint(point){
    let points = this.state.points
    points.add(point)
    this.setState(() => ({points}))
  }

  deletePoint(point){
    let points = this.state.points
    points.delete(point)
    this.setState(() => ({points: points, removedPoint: point}))
  }

  setFindLocation(location){
    this.setState(() => ({findLocation: location}))
  }

  render() {
    return (
      <div className="app">
        <DisplayMap location={this.state.location} points={this.state.points} showPoint={this.state.showPoint} removedPoint={this.state.removedPoint} 
                onSetShowPoint={showPoint => this.setState(() => ({showPoint}))} onClickLocation={loc => this.setFindLocation(loc)} onError={error => this.setState(() => ({error}))}/>
        <Search location={this.state.findLocation} points={this.state.points} onShowMyPosition={loc => this.setLocation(loc)} onCheckPoint={point => this.setState(() => ({showPoint: point}))}
                onAddPoint={point => this.addPoint(point)} onDeletePoint={point => this.deletePoint(point)} onChangePoints={points => this.setPoints(points)} onError={error => this.setState(() => ({error}))}/>
        {this.state.error ? <Error message={this.state.error} onClick={() => this.setState(() => ({error: null}))}/> : <div></div>}
      </div>
    );
  }
}

export default App;
