
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';


const commonStyles = require('../commonStyle');
const IMAGES = require('../Images');


const styles = StyleSheet.create({

  introContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  mainImage: {
    height: 100,
    width: 100,
  },
  paragraphText: {
    paddingTop: 15,
    textAlign: 'center',
    fontSize: 18,
    // fontFamily:'open-sans-regular'
  },
  heading1: {
    fontSize: 30,
    paddingTop: 30,
    fontWeight: 'bold'
  },
  buttonWrapper: {
    borderWidth: 1,
    backgroundColor: '#7F7F7F',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 40,
  },
});


export default class OnboardingComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }


  componentDidMount() {
    this.onPressResponse();
  }
  onPressResponse() {
    const { authData } = this.props;
    this.props.onPressResponse(authData);
  }
  onPressBack() {
    this.props.onPressBack();
  }
  loadDietPlan() {
    setTimeout(() => { this.onPressResponse(); }, 3000);
  }


  render() {
    const { screenData } = this.props;
    const screenImage = (screenData.current_screen.image) ? IMAGES[`${screenData.current_screen.image.split('.png')[0]}`] : 'wrap';

    return (
      <View style={commonStyles.container}>
      <StatusBar
      backgroundColor="blue"
      barStyle="light-content"
      />
        <View style={styles.introContainer}>
          {screenImage ?
            <Image source={screenImage} style={styles.mainImage} resizeMode="stretch" />
            :
            null
          }
          <Text style={[commonStyles.text1, styles.heading1]}>
            {screenData.current_screen.title}
          </Text>
          <Text style={[commonStyles.text1, styles.paragraphText]}>
            {screenData.current_screen.description}
          </Text>
          {this.state.isLoading ? <ActivityIndicator /> : null}
        </View>
      </View>
    );
  }
}

OnboardingComplete.propTypes = {
  screenData: PropTypes.shape({
    current_screen: PropTypes.shape({
      screen_data: PropTypes.object.isRequired,
    }).isRequired,
    previous_screen: PropTypes.object.isRequired,
  }).isRequired,
  authData: PropTypes.shape({
    client_id: PropTypes.string.isRequired,
    client_token: PropTypes.string.isRequired,
    client_version: PropTypes.string.isRequired,
    token_timestamp: PropTypes.number.isRequired,
  }).isRequired,
  onPressResponse: PropTypes.func.isRequired,
  onPressBack: PropTypes.func.isRequired,
};
