import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { Constants, Location, Permissions, MapView } from 'expo';
import { connect } from 'react-redux';
import * as artefactCollectionActions from '~/store/ArtefactCollection/actions';
import * as Selectors from '~/store/ArtefactCollection/reducer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  inputText: {
    height: 60,
    marginTop: 40,
    fontSize: 22,
    margin: 16,
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'stretch',
    padding: 10,
  },
});

class MapScreen extends Component {
  state = {
    locationResult: null,
    location:
      {
        coords:
          {
            latitude: 37.78825,
            longitude: -122.4324,
          }
      },
  };

  componentWillMount() {
    this.getLocationAsync();
    this.props.getArtefactCollection();
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({ locationResult: 'Permission to access location was denied' });
    }
    const location = await Location.getCurrentPositionAsync({});
    this.setState({
      locationResult: JSON.stringify(location),
      location,
    });
  };

  dismissView = () => {
    Actions.pop();
  };

  renderArtefactMarkers = () => {
    return this.props.artefactCollection.map(artefact => {
      return (
        <MapView.Marker
          coordinate={artefact.coordinates}
          title={artefact.artefact_name}
          description={artefact.default_onboarding_message[0].text}
          key={artefact._id}
          style={{display: 'flex', flexWrap: 'wrap'}}
        />
      )
    });
  }

  render() {
    const artefactCollection = JSON.stringify(this.props.artefactCollection);
    console.log('Kimba: ',this.props.artefactCollection);
    return (
      <View style={styles.container}>
        <MapView
          style={{ alignSelf: 'stretch', height: 200}}
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          loadingEnabled={true}
        >
          {this.renderArtefactMarkers()}
        </MapView>

        <Text>
        </Text>
      </View>

    );
  }
}

const mapStateToProps = (state) => ({
  artefactCollection: Selectors.getArtefactCollection(state)
});

const mapDispatchToProps = dispatch => ({
   getArtefactCollection: () => dispatch(artefactCollectionActions.getArtefactCollection()),

});


export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
