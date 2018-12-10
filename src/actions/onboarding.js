import moment from 'moment';

export function getCurrentStep() {
  return {
    type: "NEXT_STEP",
    payload: true
  }
}

export function updateCurrentStep(data) {
  return {
    type: "UPDATE_CURRENT_STEP",
    payload: data
  }
}

export function updateCurrentScreen(data) {
  return {
    type: "UPDATE_CURRENT_SCREEN",
    payload: data
  }
}

export function startLoading(){
  return {
    type: "START_LOADING",
    payload: null
  }
}

export function stopLoading(){
  return {
    type: "STOP_LOADING",
    payload: null
  }
}
