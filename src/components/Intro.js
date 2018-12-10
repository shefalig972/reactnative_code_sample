import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as onboardingActions from '../actions/onboarding';
import * as authActions from '../actions/auth';
import * as appActions from '../actions/app';
import Loading from './common/Loading';

const IMAGES = require('./Images');


const commonStyles = require('./commonStyle');
const api = require('../lib/api');
const users = require('../models/users');

const styles = StyleSheet.create({

  introContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  mainImage: {
  //  height: 100,
  //  width: 100,
  },
  paragraphText: {
    paddingTop: 15,
    textAlign: 'center',
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1 / 2,
  },
});

class Intro extends Component {

  componentWillMount() {
    const { screenData } = this.props;
    if (!screenData) {
      this.processGuestAccount();
    }
  }

  onPressGetStarted(resp) {
    const { history } = this.props;
    if (this.props.authData) {
      this.props.setFetchState(true);
      const userData = this.props.authData;
      userData.response = resp;
      const pathname = 'Intro';
      userData.step_name = pathname;
      api.processScreen('onboarding', 'process_step', userData).then((responseJson1) => {
        this.props.updateCurrentStep(responseJson1);
        this.props.setFetchState(false);
        history.push(responseJson1.current_screen.name);
      }).catch((err) => {
        this.props.setFetchState(false);
        Alert.alert(
          'Error Message',
          api.errorDescription(err),
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      });
    }
  }

  async processGuestAccount() {
    const { authData } = this.props;
    try {
      this.getHomePage(authData);
      // const guestAccount = await api.signUpGuestUser();
      // if (guestAccount && guestAccount.success) {
      //   const userDataPost = {
      //     client_id: guestAccount.client_id,
      //     client_token: guestAccount.client_token,
      //     client_version: '0.1.0',
      //     token_timestamp: guestAccount.token_timestamp,
      //   };
      //
      //   this.props.updateAuthData(userDataPost);
      //   users.setGuestAccount(userDataPost).then(() => {
      //   this.getHomePage(userDataPost);
      //   }).catch((err) => {
      //     console.log(err);
      //   });
      // }
    } catch (e) {
      console.log(e);
    }
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
          }
        }).catch((err) => {
          console.log(api.errorDescription(err));
        });
      } else if (responseJson && responseJson.errors) {
        this.processGuestAccount();
      }
    }).catch((err) => {
      console.log(api.errorDescription(err));
    });
  }

  render() {
    const { screenData, isFetching } = this.props;
    console.log(screenData);
    let screenImage;
    if (screenData && screenData.current_screen) {
       screenImage = (screenData.current_screen.image) ?
      IMAGES[`${screenData.current_screen.image.split('.png')[0]}`] : null;
    } else {
      screenImage = null;
    }
      return (
        <View
        style={[
          commonStyles.container,
          { flexDirection: 'column', justifyContent: 'space-between' }
        ]}
        >
        {isFetching ?
          <Loading />
          : null
        }
        {screenImage ?
          <View style={styles.introContainer}>
            <Image source={screenImage} style={styles.mainImage} resizeMode="stretch" />
              <Text style={[commonStyles.text1, styles.heading1]}>
              {screenData.current_screen.title}
            </Text>
            <Text style={[commonStyles.text1, styles.paragraphText]}>
              {screenData.current_screen.description}
            </Text>
          </View>
          :
          null
        }
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={commonStyles.buttonWrapper}
              onPress={() => this.onPressGetStarted('none_needed')}
            >
              <Text style={commonStyles.buttonText}>GET STARTED</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    //}
  }
}

function mapStateToProps(state, props) {
  return {
    screenData: state.onboardingReducer.screenData,
    authData: state.authReducer.authUser,
    isFetching: state.appReducer.isFetching,
    props,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...onboardingActions, ...authActions, ...appActions }, dispatch);
}

// Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Intro);
