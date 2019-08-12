module.exports = {
  users: [
    {
      _id: 'abc123',
      emails: [{ verified: true, address: 'admin@admin.com' }],
      profile: {
        firstName: 'Andy',
        lastName: 'Warhol',
      },
      roles: ['admin'],
    },
    {
      _id: 'def123',
      emails: [{ verified: true, address: 'user+1@test.com' }],
      profile: {
        firstName: 'Hieronymus',
        lastName: 'Bosch',
      },
      roles: ['user'],
    },
    {
      _id: 'ghi123',
      emails: [{ verified: true, address: 'user+2@test.com' }],
      profile: {
        firstName: 'Jean-Michel',
        lastName: 'Basquiat',
      },
      roles: ['user'],
    },
  ],
};
