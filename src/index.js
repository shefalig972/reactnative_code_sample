
/* @flow */
/* eslint global-require: 0 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar
 } from 'react-native';
import { Switch, Route, Redirect } from 'react-router';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import onboardingReducer from './reducers/onboardingReducer';
import homeReducer from './reducers/homeReducer';
import authReducer from './reducers/authReducer';
import planReducer from './reducers/planReducer';
import appReducer from './reducers/appReducer';

// components
import Splash from './components/Splash';
import Home from './components/home/Home';
import HomeScreen from './components/home/HomeScreen';
import WebLink from './components/home/WebLink';
import FavouritesScreen from './components/home/FavouritesScreen';
import App from './components/App';
import PlanContainer from './components/plans/PlanContainer';
import Intro from './components/Intro';
import EditSymptoms from './components/home/EditSymptoms';
import RecipeDetail from './components/home/RecipeDetail';

const {THEME_COLOR} = require("./theme");
const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  topBarContainer: {
    backgroundColor: THEME_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  smallButtonWrapper: {
    backgroundColor: '#57EED2',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    padding: 4,
    borderRadius: 5,
  },
  smallButtonText: {
    color: '#588AE7',
    fontSize: 10,
  },
  navbar: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#ECECEF"
  },
});

const history = createHistory();
const historyMiddleware = routerMiddleware(history);
// const loggerMiddleware = () => next => action => {
//   if (action && action.type === '@@router/LOCATION_CHANGE') {
//     console.log(history.entries.map(({ pathname }) => pathname))
//   }
//   if (action) next(action)
// }

const store = createStore(
  combineReducers({
    onboardingReducer,
    authReducer,
    homeReducer,
    planReducer,
    appReducer,
    router: routerReducer,
  }),
  applyMiddleware(historyMiddleware),
);

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }


  render() {
    console.log("Render Index");
      return (
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/" render={() => <Splash />} />
              <Route exact path="/Intro" render={() => <Intro history={history} />} />
              <Route exact path="/Home" render={() => <Redirect to={"/Home/HomeScreen"} />} />
              <Route
                path="/Home/:screens"
                render={() => (
                  <Home history={history} />
                  )}
              />
              <Route exact path="/Plan" render={() => <Redirect to={"/Plan/Phase1"} />} />
              <Route
                path="/Plan/:steps"
                render={() => (
                    <PlanContainer history={history} />
                  )}
              />
              <Route
                path="/weblink/:url"
                render={() => (
                  <WebLink history={history} />
                  )}
              />
              <Route
                path="/:steps"
                render={() => (
                  <View style={styles.tabs}>
                    <App history={history} />
                  </View>
                    )}
              />
            </Switch>
          </ConnectedRouter>
        </Provider>
      );
    }
}
