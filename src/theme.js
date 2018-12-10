/* @flow */
import { Dimensions, Platform } from 'react-native'

export const BODY_COLOR = '#402698'
export const THEME_COLOR = '#6A0BFC'
export const HEADER_COLOR = '#393996'
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
