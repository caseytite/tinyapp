const { assert } = require('chai');
const bcrypt = require('bcryptjs');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  1: { id: '1', email: 'cjt@123.com', password: bcrypt.hashSync('123', 10) },
  2: { id: '2', email: 'ojt@123.com', password: bcrypt.hashSync('1234', 10) },
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail('cjt@123.com', testUsers);
    const expectedUserID = '1';
    assert.deepEqual(user, { id: expectedUserID, email: 'cjt@123.com' });
  });
  it('should return undefined if a user does not exists', function () {
    const user = getUserByEmail('cjt1@123.com', testUsers);
    assert.equal(user, undefined);
  });
});
