import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BottomNavigation, Tab } from 'react-router-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';

import { THEME_COLOR, HEADER_COLOR } from '../../theme';

import HomeScreen from './HomeScreen';
import FavouritesScreen from './FavouritesScreen';
import EditSymptoms from './EditSymptoms';

export default class Home extends Component {
  render() {
    const { history } = this.props;
    console.log(history);
    return (
      <BottomNavigation
      lazy={false}
      tabTintColor={HEADER_COLOR}
      tabActiveTintColor={THEME_COLOR}
      >
        <Tab
          label="Home"
          path="/Home/HomeScreen"
          component={HomeScreen}
          renderTabIcon={({ focused, tabTintColor, tabActiveTintColor }) => (
            <Icon
            name="home"
            color={focused ? tabActiveTintColor : tabTintColor}
            size={20}
            />
          )}
        />
        <Tab
          label="Favourites"
          path="/Home/Favourites"
          component={FavouritesScreen}
          onIndexChange={() => history.replace('/Home/Favourites')}
          onReset={() => history.replace('/Home/Favourites')}
          renderTabIcon={({ focused, tabTintColor, tabActiveTintColor }) => (
            <IonIcons
            name="ios-heart-outline"
            color={focused ? tabActiveTintColor : tabTintColor}
            size={20}
            />
          )}
        />

        <Tab
          label="Symptoms"
          path="/Home/EditSymptoms"
          component={EditSymptoms}
          renderTabIcon={({ focused, tabTintColor, tabActiveTintColor }) => (
            <Icon
            name="edit"
            color={focused ? tabActiveTintColor : tabTintColor}
            size={20}
            />
          )}
        />
      </BottomNavigation>
    );
  }
}

Home.propTypes = {
  history: PropTypes.object,
};
