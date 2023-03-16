import {
  AUTHENTICATE,
  INIT_USER,
  UPDATE_USER,
  LOGOUT,
  UPDATE_SUBSCRIPTIONS,
} from "./actionsType";

export function authenticate(token, userPseudo) {
  return {
    type: AUTHENTICATE,
    payload: { token, userPseudo },
  };
}

export function logout() {
  return {
    type: LOGOUT,
    payload: {},
  };
}

export function initUser(user, userSubscriptions) {
  return {
    type: INIT_USER,
    payload: { user, userSubscriptions },
  };
}

export function updateLocalUser(user) {
  return {
    type: UPDATE_USER,
    payload: { user },
  };
}

export function updateSubscriptions(userSubscriptions) {
  return {
    type: UPDATE_SUBSCRIPTIONS,
    payload: { userSubscriptions },
  };
}
