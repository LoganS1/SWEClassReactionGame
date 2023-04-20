const login = require("/index.js");

test('check user login', () => {
    expect(login(Drew, Drew)).toBe(true);
  });