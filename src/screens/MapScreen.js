import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { Constants, Location, Permissions, MapView } from 'expo';
import { connect } from 'react-redux';
import * as artefactCollectionActions from '~/store/ArtefactCollection/actions';

import * as Selectors from '~/store/ArtefactCollection/reducer';
import * as chatActions from '~/store/Chats/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  bubbleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 250,
  },
  bubbleDescription: {
    fontSize: 12,
    width: 250,
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
          },
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


  openMapThread = async (artefact_id, artefact_name) => {
    this.props.openMapThread(artefact_id, artefact_name);
  }

  renderArtefactMarkers = () => this.props.artefactCollection.map(artefact => {
    return (
      <MapView.Marker
        coordinate={artefact.coordinates}
        key={artefact._id}
      >
        <MapView.Callout onPress={() => this.openMapThread(artefact.artefact_id, artefact.artefact_name)}>
          <Text style={styles.bubbleTitle}>
            {artefact.artefact_name}
          </Text>
          <Text style={styles.bubbleDescription}>
            {artefact.default_onboarding_message[0].text}
          </Text>
        </MapView.Callout>
      </MapView.Marker>
    )
  })

  render() {
    const artefactCollection = JSON.stringify(this.props.artefactCollection);
    return (
      <View style={styles.container}>
        <MapView
          style={{ alignSelf: 'stretch', height: 200 }}
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          loadingEnabled
        >
          {this.renderArtefactMarkers()}
        </MapView>
      </View>

    );
  }
}

const mapStateToProps = state => ({
  artefactCollection: Selectors.getArtefactCollection(state),
});

const mapDispatchToProps = dispatch => ({
  getArtefactCollection: () => dispatch(artefactCollectionActions.getArtefactCollection()),

  openMapThread: (artefactId, artefactName) =>
    dispatch(chatActions.openMapThread(artefactId, artefactName)),
});


export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

