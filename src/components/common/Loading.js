/**
 * Swiper
 * Renders a swipable set of screens passed as children,
 * pagination indicators and a button to swipe through screens
 * or to get out of the flow when the last screen is reached
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import {screenWidth, screenHeight} from '../../theme';

export default class Loading extends Component {
  render() {
    return (
      <View style = {styles.fullBack}>
        <View style = {styles.spinnerContainer}>
          <ActivityIndicator size="large"/>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  fullBack: {
    position:'absolute',
    width:screenWidth,
    height: screenHeight,
    flex:1,
    //backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:999,
    opacity:0.8
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
    bottom:0
  }
});
