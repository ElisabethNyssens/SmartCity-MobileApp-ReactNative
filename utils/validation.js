export function validatePassword(password) {
  return /\d/.test(password) && password.trim().length >= 7;
}

export function validateEmail(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}
