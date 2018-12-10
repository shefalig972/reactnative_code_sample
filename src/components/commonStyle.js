//* @flow */


import { StyleSheet, Dimensions } from 'react-native';
import { THEME_COLOR, HEADER_COLOR } from '../theme';

const screenWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  text1: {
    color: '#FFFFFF',
  },
  text2: {
    color: '#4D4D4D',
  },
  buttonWrapper: {
    backgroundColor: '#6C2DFC',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 50,
    borderRadius: 50,
    marginLeft: 30,
    marginRight: 30,
    alignSelf: 'center'

  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: HEADER_COLOR,
    borderColor: HEADER_COLOR
  },
  stepsHeading: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  introContainer: {
    width: screenWidth,
    backgroundColor: '#373D96',
    paddingBottom: 40
    //flex:1,
    //height: screenHeight/2
  },
  contentContainer: {
    paddingBottom: 20,
    width: screenWidth,
    paddingLeft: 20,
    paddingRight: 20
  },
  heading1: {
    fontSize: 30,
    paddingTop: 20,
    textAlign: 'center',
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: 'bold'
  },
  paragraphText: {
    textAlign: 'center',
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
  },
  selectedItemTextContainer: {
    backgroundColor: '#6C2DFC',
    margin: 2,
    zIndex: -1,
    borderWidth: 1,
    borderColor: '#6C2DFC',
    borderRadius: 5,
    padding: 5,
  },
  selectedItemText: {
    color: '#FFFFFF',
    //fontSize:12
  },
  selectedItemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: screenWidth,
    zIndex: -1,

  },
  labelText: {
  //  fontSize: 12
  },
  InputText: {
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#6C2DFC',
    padding: 2
  },
  inputWrapper: {
    flex: 1,
    margin: 10,
    padding: 5,
  //  maxWidth:400
  },
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#B492FD',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#6C2DFC',
    borderColor: '#6C2DFC',
    borderWidth: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    padding: 0
  },
  onboardingTitleSeperator: {
    borderBottomColor: '#8485BE',
    borderBottomWidth: 2,
    width: 20,
    paddingTop: 2
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarContainer: {
    backgroundColor: THEME_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  navbar: {
    height: 60,
    alignItems: 'center',
    backgroundColor: '#ECECEF',
    paddingTop: 10
  },
});
