export const testEmployees = [
    {
        id: '123456',
        firstName: 'testemployee1',
        lastName: 'testemployeelastname1',
        email: 'testemployee1@email.com',
        password: 'somepassword1',
    },
    {
        id: '123456',
        firstName: 'testemployee1',
        lastName: 'testemployeelastname2',
        email: 'testemployee2@email.com',
        password: 'somepassword2',
    }
]

export const testEmployeesWithoutPassword = JSON.parse(JSON.stringify(testEmployees))
testEmployeesWithoutPassword.forEach((employee: any) => {
    delete employee.password;
});
