import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 9.936064;
const LONGITUDE = -84.103382;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyC8mGks3qbFCLzbum4CpqhGMhaOucjq3iY';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {

      latitude: null,
      longitude: null,

      concat: null,

      cordLatitude: 10.359609,
      cordLongitude: -84.509056,

      cordConcat: null,

      coordinates: [
        {
          latitude: 0,
          longitude: 0,
        },
        {
          latitude: 10.359609,
          longitude: -84.509056,
        },
      ],
    };

    this.mapView = null;
    
    this.mergeLot = this.mergeLot.bind(this);
  }

  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
       (position) => {
         this.setState({
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           error: null,
         });
         this.mergeLot();
       },
       (error) => this.setState({ error: error.message }),
       { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
     );
  }

  mergeLot(){
    if (this.state.latitude != null && this.state.longitude != null)
     {
       let concatLot = this.state.latitude + "," + this.state.longitude
       this.setState({
         concat: concatLot
       });
     }
  }

  render() {
    return (
      <MapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={StyleSheet.absoluteFill}
        ref={c => this.mapView = c}
        onPress={this.onMapPress}
      >
        {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
         coordinate={{"latitude":this.state.latitude,"longitude":this.state.longitude}}
         title={"Tú estás aquí"}
        />}

        {!!this.state.cordLatitude && !!this.state.cordLongitude && <MapView.Marker
         coordinate={{"latitude":this.state.cordLatitude,"longitude":this.state.cordLongitude}}
         title={"Aquí está tu comida"}
        />}

        {(this.state.coordinates.length >= 2) && (
          <MapViewDirections
            origin={this.state.concat}
            waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): null}
            destination={this.state.coordinates[this.state.coordinates.length-1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="hotpink"
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={(result) => {
              this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: (width / 20),
                  bottom: (height / 20),
                  left: (width / 20),
                  top: (height / 20),
                }
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        )}
      </MapView>
    );
  }
}

export default App;