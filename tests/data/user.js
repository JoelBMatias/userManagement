const userDataFirst = {
  email: 'joel.matias@gmail.com',
  givenName: 'Joel',
  familyName: 'Matias'
};

const userDataSecond = {
  email: 'joel.bernardo@gmail.com',
  givenName: 'Joel',
  familyName: 'Bernardo'
};

const userDataThird = {
  email: 'joel.pereira@gmail.com',
  givenName: 'Pereira',
  familyName: 'Bernardo'
};

const userDataConflict = {
  email: 'joel.matias@gmail.com',
  givenName: 'Joel',
  familyName: 'Bernardo'
};

const userDataUpdate = {
  id: 1,
  givenName: 'Pereira',
  familyName: 'Bernardo'
};

const userDataUpdateConflict = {
  id: 2,
  email: 'joel.matias@gmail.com'
};

const specificUserData = [
  {
    id: 2,
    email: 'joel.bernardo@gmail.com',
    givenname: 'Joel',
    familyname: 'Bernardo'
  }
];

const allUserData = [
  {
    id: 2,
    email: 'joel.bernardo@gmail.com',
    givenname: 'Joel',
    familyname: 'Bernardo'
  },
  {
    id: 3,
    email: 'joel.pereira@gmail.com',
    givenname: 'Pereira',
    familyname: 'Bernardo'
  }
];

module.exports = {
  userDataFirst,
  userDataSecond,
  userDataThird,
  userDataConflict,
  userDataUpdate,
  userDataUpdateConflict,
  specificUserData,
  allUserData
};
