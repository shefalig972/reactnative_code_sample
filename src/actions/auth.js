import moment from 'moment';

export function updateAuthData(data) {
  return {
    type: "UPDATE_AUTH_DATA",
    payload: data
  }
}
