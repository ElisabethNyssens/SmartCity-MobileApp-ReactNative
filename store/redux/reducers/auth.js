import AsyncStorage from "@react-native-async-storage/async-storage";

const initialAuthState = {
  token: null,
  isAuthenticated: false,
  userPseudo: "",
  user: {},
  userSubscriptions: [],
};

import {
  AUTHENTICATE,
  INIT_USER,
  UPDATE_USER,
  LOGOUT,
  UPDATE_SUBSCRIPTIONS,
} from "../actions/actionsType";

export const auth = (state = initialAuthState, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("user", action.payload.userPseudo);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        userPseudo: action.payload.userPseudo,
      };
    }
    case INIT_USER: {
      return {
        ...state,
        user: action.payload.user,
        userSubscriptions: action.payload.userSubscriptions,
      };
    }
    case UPDATE_USER: {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case UPDATE_SUBSCRIPTIONS: {
      return {
        ...state,
        userSubscriptions: action.payload.userSubscriptions,
      };
    }
    case LOGOUT: {
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      return initialAuthState;
    }
    default:
      return state;
  }
};
