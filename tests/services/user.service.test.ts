import userService from '../../src/services/user.service'
import { IUser } from '../../src/models/user'
import DatabaseManager from '../../src/mongo/databaseManager'
import { populateUsersInTestDb, cleanupDb } from '../utils/dbPopulation'
import { testUsers } from '../utils/mockData'
import { MongoMemoryServer } from 'mongodb-memory-server';

describe("Users Service", () => {  
    const mongod = new MongoMemoryServer();
    let mongoDatabase: DatabaseManager;

    beforeAll(async (done) => {
        const uri = await mongod.getConnectionString();
        const dbName = await mongod.getDbName();

        mongoDatabase = new DatabaseManager(
            uri,
            dbName
        );

        await mongoDatabase.connect();
        await populateUsersInTestDb(testUsers);
        done();
    });

    afterAll(async (done) => {
        await cleanupDb();
        await mongoDatabase.disconnect();
        await mongod.stop();
        done();
    });

    it("gets a user by id", async (done) => { 
        let user = await userService.get(testUsers[0]._id.toHexString());
        expect(user).toEqual(testUsers[0]);
        done();
    });

    it("gets a user by one AND more fields", async (done) => {
        let user = await userService.getByFields({
            username: testUsers[0].username,
            email: 'randomemail'
        });

        expect(user).toEqual(null);

        user = await userService.getByFields({
            username: testUsers[0].username,
            email: testUsers[0].email
        });

        expect(user).toEqual(testUsers[0]);
        done();
     });

    it("gets all users", async (done) => {
        const users = await userService.getAll();
        users.forEach((user: IUser, index: number) => {
            expect(user._id).toEqual(testUsers[index]._id);
            expect(user.username).toEqual(testUsers[index].username);
            expect(user.password).toEqual(testUsers[index].password);
            expect(user.email).toEqual(testUsers[index].email);
            expect(user.portfolios).toEqual(testUsers[index].portfolios);
        });
        done();
    });

    it("gets a user by one OR more fields", async (done) => { 
        let user = await userService.getByEitherFields(
            [
                { username: testUsers[0].username },
                { email: 'randomemail' }
            ]);

        expect(user).toEqual(testUsers[0]);

        user = await userService.getByEitherFields(
            [
                { username: 'randomusername' },
                { email: testUsers[1].email }
            ]);

        expect(user).toEqual(testUsers[1]);
        done();
    });

    it("gets all users by one AND more fields", async (done) => { 
        const users = await userService.getAllByFields({username: testUsers[1].username});
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual(testUsers[1].email);
        done();
    });
    
    it("creates a user", async (done) => { 
        const userToCreate = {
            username: 'testusername',
            password: 'testpassword',
			email: 'testemail@email.com',
        }

        const user = await userService.create(userToCreate as IUser);

        expect(user.username).toEqual(userToCreate.username);
        expect(user.password).toEqual(userToCreate.password);
        expect(user.email).toEqual(userToCreate.email);

        const userFromDb = await userService.get(user._id);

        expect(userFromDb.username).toEqual(userToCreate.username);
        expect(userFromDb.password).toEqual(userToCreate.password);
        expect(userFromDb.email).toEqual(userToCreate.email);

        done();
    });

    it("updates a user", async (done) => { 
        const userToUpdate = {
            _id: testUsers[0]._id,
            username: 'newrandomusername',
            email: 'newrandomemail@email.com'
        } as unknown as IUser

        await userService.update(userToUpdate);
        const updatedUser = await userService.get(testUsers[0]._id.toHexString());

        expect(updatedUser.username).not.toEqual(testUsers[0].username);
        expect(updatedUser.email).not.toEqual(testUsers[0].email);

        expect(updatedUser.username).toEqual('newrandomusername');
        expect(updatedUser.email).toEqual('newrandomemail@email.com');
        expect(updatedUser.password).toEqual(testUsers[0].password);

        done();
    });
    
    it("deletes a user", async (done) => { 
        await userService.delete(testUsers[0]._id.toHexString());

        const deletedUser = await userService.get(testUsers[0]._id.toHexString());
        expect(deletedUser).toBeNull();
        done();
    });
});