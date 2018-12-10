/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navigation, Card } from 'react-router-navigation';
// import { RouterHistory } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/onboarding';
import * as HomeActions from '../actions/home';
import * as AppActions from '../actions/app';

import TakenLabTest from './onboarding/TakenLabTest';
import TestResults from './onboarding/TestResults';
import FoodSuspicions from './onboarding/FoodSuspicions';
import Symptoms from './onboarding/Symptoms';
import CreateAccount from './onboarding/CreateAccount';
import OnboardingComplete from './onboarding/OnboardingComplete';
import NoScreenFound from './NoScreenFound';

const api = require('../lib/api');
const services = require('../lib/services');

class App extends Component {
  shouldComponentUpdate() {
    return false;
  }

  onPressNext(data) {
    this.props.setFetchState(true);
    const { history } = this.props;
    api.processScreen('onboarding', 'process_step', data).then((responseJson) => {
      this.props.updateCurrentStep(responseJson);
      this.props.setFetchState(false);
      history.push(responseJson.current_screen.name);
    });
  }

  onPressResponse(resp) {
    this.props.setFetchState(true);
    const { authData, history } = this.props;
    authData[`${'response'}`] = resp;
    const pathname = history.location.pathname.split('/');
    authData[`${'step_name'}`] = pathname['1'];
    api.processScreen('onboarding', 'process_step', authData).then((responseJson1) => {
      this.props.updateCurrentStep(responseJson1);
      this.props.setFetchState(false);
      history.push(responseJson1.current_screen.name);
    });
  }

  onPressBack() {
    this.props.setFetchState(true);
    const { screenData, history, authData } = this.props;
    const previousScreen = screenData.previous_screen ? screenData.previous_screen.name : 'Intro';
    authData.screen_name = previousScreen;
    api.getCurrentOnboardingScreen(authData).then((responseJson) => {
      this.props.updateCurrentStep(responseJson);
      this.props.setFetchState(false);
      history.push(responseJson.current_screen.name);
    });
  }

  onPressCompleteOnboarding() {
    const { authData, history } = this.props;
    api.getHomePage(authData).then((responseJson) => {
      if (responseJson && responseJson.success && responseJson.controller) {
        api.processScreen(
          responseJson.controller,
          responseJson.action,
          authData,
        ).then((responseJson1) => {
          console.log(responseJson1);
            this.props.setHomeContent(responseJson1);
            this.fetchRecipes('breakfast', 0, responseJson1);
            }).catch((err) => {
          console.log(api.errorDescription(err));
          history.push('/Home');
        });
      } else {
        history.push('/Home');
      }
    });
  }

   fetchRecipes(searchText, offset, homeScreen) {
    const { history } = this.props;
    this.setState({ loading: true });
    const diet = homeScreen.diet ? homeScreen.diet[0].name : null;
    const foodSenstivities = homeScreen.food_senstivities ? homeScreen.food_senstivities : null;
    let queryParams = '';
    if (diet) {
      if (diet === 'High-Protein' || diet === 'Low-Carb') {
        queryParams += `&Diet=${services.getDietName(diet)}`;
      } else {
          queryParams += `&health=${services.getDietName(diet)}`;
      }
    }
    if (homeScreen && homeScreen.user_food_suspicions.length > 0) {
        queryParams += '&health=dairy-free&health=gluten-free';
    } else if (foodSenstivities) {
      const isDairy = foodSenstivities.find(food => {
        return food.category === 'Dairy';
      });
      if (isDairy) {
        queryParams += '&health=dairy-free';
      }
      const foodSenstivitiesArr = foodSenstivities.filter(food => {
        return food.category !== 'Dairy';
      });
       foodSenstivitiesArr.map(food => {
         let foodName = '';
         // if (food && food.synonyms) {
         //   if (food.synonyms.includes('|')) {
         //     const synonyms = food.synonyms.split('|');
         //     for (let synonym of synonyms) {
         //       const name = services.convertToQueryParams(synonym);
         //       queryParams += `&excluded=${name}`;
         //      }
         //   } else {
         //     const synonyms = food.synonyms;
         //     const name = services.convertToQueryParams(synonyms);
         //     queryParams += `&excluded=${name}`;
         //   }
         // }

        foodName = services.convertToQueryParams(food.name);

       queryParams += `&excluded=${foodName}`;
       return queryParams;
    });
  }
    api.getRecipes(searchText, queryParams, offset).then(responseJson => {
      //  const { recipes } = this.state;
        if (offset === 0) {
          this.props.setUserRecipies(responseJson);
          history.push('/Home');
          //this.setState({ loading: false, recipes: responseJson, isRefreshing: false });
        } else {
          //const recipeList = recipes.concat(responseJson);
          this.props.updateUserRecipies(responseJson);
          history.push('/Home');
          //this.setState({ loading: false, recipes: recipeList, isRefreshing: false });
        }
    }).catch(err => {
      history.push('/Home');
      //this.setState({ loading: false, isRefreshing: false });
      console.log(err);
    });
  }


  render() {
    const { history } = this.props;
    return (
      <Navigation hideNavBar="true">

        <Card
          path="/Taken Lab Test"
          render={() =>
            (<TakenLabTest
              onPressResponse={resp => this.onPressResponse(resp)}
              {...this.props}
              onPressBack={() => this.onPressBack()}
            />)
        }
        />
        <Card
          path="/Test Results"
          render={() =>
            (<TestResults
              onPressBack={() => this.onPressBack()}
              onPressResponse={resp => this.onPressNext(resp)}
              {...this.props}
            />)
        }
        />
        <Card
          path="/Food Suspicions"
          render={() =>
            (<FoodSuspicions
              onPressBack={() => this.onPressBack()}
              onPressResponse={resp => this.onPressNext(resp)}
              {...this.props}
            />)
        }
        />
        <Card
          path="/Symptoms"
          render={() =>
            (<Symptoms
              onPressBack={() => this.onPressBack()}
              onPressResponse={resp => this.onPressNext(resp)}
              {...this.props}
            />)
        }
        />
        <Card
          path="/Create Account"
          render={() =>
            (<CreateAccount
              onPressBack={() => this.onPressBack()}
              onPressResponse={resp => this.onPressNext(resp)}
              {...this.props}
            />)
        }
        />
        <Card
          path="/Onboarding Complete"
          render={() =>
            (<OnboardingComplete
              onPressBack={() => this.onPressBack()}
              onPressResponse={resp => this.onPressCompleteOnboarding(resp)}
              {...this.props}
            />)
        }
        />
        <Card
          path="/:any"
          render={() =>
            <NoScreenFound history={history} />
        }
        />
      </Navigation>
    );
  }
}

App.propTypes = {
  screenData: PropTypes.shape({
  }).isRequired,
  authData: PropTypes.shape({
    client_id: PropTypes.string.isRequired,
    client_token: PropTypes.string.isRequired,
    client_version: PropTypes.string.isRequired,
    token_timestamp: PropTypes.number.isRequired,
  }).isRequired,
  history: PropTypes.shape({

  }).isRequired,
  updateCurrentStep: PropTypes.func.isRequired,
  updateHomeContent: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    screenData: state.onboardingReducer.screenData,
    authData: state.authReducer.authUser,
    isFetching: state.appReducer.isFetching,
    props,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...HomeActions, ...AppActions }, dispatch);
}


// Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(App);
