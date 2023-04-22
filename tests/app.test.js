const app = require('../app.js');

// getUsernameFromSessionKey,
// checkUsername,
// saveScore,
// addUser,
// validateLogin,
// addSession

const testUser = "testUser";
const testPassword = "testPassword";
const testSessionKey = "f2d4bc8e-b2ab-4b48-ba36-b5e7132d2f99";
const testScore = 9034;
const testRoom = "testRoom";
const newUserName = "testUser1";
const newUserPassword = "testPassword1";
const testUser2 = "testUser2";

test('getUsernameFromSessionKey Found', ()=>{
  expect(app.getUsernameFromSessionKey(testSessionKey)).toBe(testUser);
})

test('getUsernameFromSessionKey Not Found', ()=>{
  expect(app.getUsernameFromSessionKey("aaa")).toBe(false);
})

test('getUsernameFromSessionKey None', ()=>{
  expect(app.getUsernameFromSessionKey()).toBe(false);
})

test('checkUsername Found', ()=>{
  expect(app.checkUsername(testUser)).toBe(true)
})

test('checkUsername Not Found', ()=>{
  expect(app.checkUsername("a")).toBe(false)
})

test('checkUsername None', ()=>{
  expect(app.checkUsername()).toBe(true)
})

test('validateLogin Found', ()=>{
  expect(app.validateLogin(testUser, testPassword)).toBe(true);
})

test('validateLogin User Not Found', ()=>{
  expect(app.validateLogin("a", testPassword)).toBe(false);
})

test('validateLogin Pass Not Found', ()=>{
  expect(app.validateLogin(testUser, "a")).toBe(false);
})

test('addUser', ()=>{
  app.addUser(newUserName, newUserPassword)
  expect(app.validateLogin(newUserName, newUserPassword)).toBe(true)
})

test('addSession', ()=>{
  let testNewSessionKey = "aaaa";
  app.addSession(testUser2, testNewSessionKey);
  let foundUser = app.getUsernameFromSessionKey(testNewSessionKey);
  expect(foundUser).toBe(testUser2);
})

test('closeTests', ()=>{
  app.close();
  expect(true).toBe(true);
})