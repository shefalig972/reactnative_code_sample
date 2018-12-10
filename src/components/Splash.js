import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
  Image,
  Text,
  AsyncStorage

} from 'react-native';
import { Redirect } from 'react-router-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as onboardingActions from '../actions/onboarding';
import * as authActions from '../actions/auth';
import * as HomeActions from '../actions/home';


const api = require('../lib/api');
const users = require('../models/users');
const imageLogo = require('../assets/img/spoonful-logo.png');

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenData: null,
    };
  }

  componentWillMount() {
    // AsyncStorage.clear();
    // return false;
    users.guestAccount().then((resp) => {
      if (resp) {
        this.props.updateAuthData(resp);
        this.getHomePage(resp);
      } else {
        //console.log("Into");
        //this.setState({ screenData: 'Intro' });
        this.processGuestAccount();
      }
    }).catch((e) => {
      Alert.alert(
        'Error Message',
        api.errorDescription(e),
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    });
  }


  getHomePage(userDataPost) {
    api.getHomePage(userDataPost).then((responseJson) => {
      if (responseJson && responseJson.success && responseJson.controller) {
        api.processScreen(
          responseJson.controller,
          responseJson.action,
          userDataPost,
        ).then((responseJson1) => {
          console.log(responseJson1);
          if (responseJson1 && responseJson1.current_screen) {
            this.props.updateCurrentStep(responseJson1);
            this.setState({ screenData: responseJson1 });
          } else {
            this.props.updateHomeContent(responseJson1);
            this.setState({ screenData: 'Home' });
          }
        }).catch((err) => {
          console.log(api.errorDescription(err));
          this.setState({ screenData: 'Home' });
        });
      } else if (responseJson && responseJson.errors) {
        this.processGuestAccount();
        //this.setState({ screenData: 'Intro' });
      } else {
        this.props.updateHomeContent(responseJson);
        this.setState({ screenData: 'Home' });
      }
    }).catch((err) => {
      console.log(api.errorDescription(err));
      //this.processGuestAccount();
    });
  }

  async processGuestAccount() {
    try {
      const guestAccount = await api.signUpGuestUser();
      if (guestAccount && guestAccount.success) {
        const userDataPost = {
          client_id: guestAccount.client_id,
          client_token: guestAccount.client_token,
          client_version: '0.1.0',
          token_timestamp: guestAccount.token_timestamp,
        };

        this.props.updateAuthData(userDataPost);
        users.setGuestAccount(userDataPost).then(() => {
          this.setState({ screenData: 'Intro' });
          //this.getHomePage(userDataPost);
        }).catch((err) => {
          console.log(err);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.screenData) {
      const currentScreen = (this.state.screenData.current_screen) ?
        this.state.screenData.current_screen.name :
        this.state.screenData;
        console.log('Current screen:', currentScreen);
      return (
        <Redirect to={currentScreen} />
      );
    }
    return (
      <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
        }}
      >
      <Text>Checking user session...</Text>
          {/*<Image
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: Dimensions.get('window').width,
              height: 400,
            }}
            resizeMode="cover"
            source={imageLogo}
          />*/}
          </View>
    );
  }
}

Splash.propTypes = {
  updateAuthData: PropTypes.func.isRequired,
  updateCurrentStep: PropTypes.func.isRequired,
  updateHomeContent: PropTypes.func.isRequired,

};

// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  return {
    screenData: state.onboardingReducer.screenData,
    props,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...onboardingActions, ...authActions, ...HomeActions }, dispatch);
}

// Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Splash);
