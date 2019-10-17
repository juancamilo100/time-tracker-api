import { User } from '../../src/models/user'
import { Portfolio } from '../../src/models/portfolio';

const populateUsersInTestDb = async (testUsers: Array<object>) => {
    await User.collection.insertMany(testUsers);
}

const populatePortfoliosInTestDb = async (testPortfolios: Array<object>) => {
    await Portfolio.collection.insertMany(testPortfolios);
}

const cleanupDb = async () => {
    await User.remove({}).exec();
    await Portfolio.remove({}).exec();
}

export { 
    populateUsersInTestDb, 
    cleanupDb,
    populatePortfoliosInTestDb
}
