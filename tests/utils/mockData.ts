export const testUsers = [
    {
        id: '123456',
        firstName: 'testuser1',
        lastName: 'testuserlastname1',
        email: 'testuser1@email.com',
        password: 'somepassword1',
    },
    {
        id: '123456',
        firstName: 'testuser1',
        lastName: 'testuserlastname2',
        email: 'testuser2@email.com',
        password: 'somepassword2',
    }
]

export const testUsersWithoutPassword = JSON.parse(JSON.stringify(testUsers))
testUsersWithoutPassword.forEach((user: any) => {
    delete user.password;
});
