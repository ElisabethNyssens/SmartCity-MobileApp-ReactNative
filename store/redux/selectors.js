export const getIsAuthenticated = (store) => store.auth.isAuthenticated;
export const getToken = (store) => store.auth.token;
export const getCurrentUserPseudo = (store) => store.auth.userPseudo;
export const getCurrentUser = (store) => store.auth.user;
export const getCurrentUserLocation = (store) => store.auth.user.citylocation;
export const getCurrentUserSubscriptions = (store) => store.auth.userSubscriptions;
