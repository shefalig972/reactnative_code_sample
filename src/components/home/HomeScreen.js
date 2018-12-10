import React, { Component } from 'react';
import {
  View, Text
} from 'react-native';
import { Navigation, Card } from 'react-router-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RecipeList from './RecipeList';
import RecipeDetail from './RecipeDetail';
import WebLink from './WebLink';

import * as Actions from '../../actions/home';

class HomeScreen extends Component {

onPressBack() {
  const { history } = this.props;
  history.goBack();
}
  render() {
    const { match } = this.props;
    if (match === null) {
      return (
        <View>
          <Text>....</Text>
        </View>
      );
    }
    const url = match.url;
    return (
      <Navigation
      hideNavBar="true"
      >
        <Card
          exact
          path={url}
          render={() =>
            (<RecipeList
              updateUserRecipies={(resultData) => this.props.updateUserRecipies(resultData)}
              updateHomeScreen={() => this.props.updateHomeScreen()}
               {...this.props}
            />)
        }
        />
        <Card
          path={`${url}/RecipeDetail/:id`}
          render={() =>
            (<RecipeDetail
              {...this.props}
              onPressBack={() => this.onPressBack()}
            />
            )
        }
        />

      </Navigation>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(state, props) {
  return {
    homeScreen: state.homeReducer.homeScreen,
    recipes: state.homeReducer.recipes,
    authData: state.authReducer.authUser,
    props,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
