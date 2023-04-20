const login = require("../public/index.js");

test('check user login', () => {
    expect(login(Drew, Drew)).toBe(true);
  });