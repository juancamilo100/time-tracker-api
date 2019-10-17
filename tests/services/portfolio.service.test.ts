import portfolioService from '../../src/services/portfolio.service'
import { IPortfolio } from '../../src/models/portfolio'
import DatabaseManager from '../../src/mongo/databaseManager'
import { populatePortfoliosInTestDb, cleanupDb } from '../utils/dbPopulation'
import { testPortfolios } from '../utils/mockData'
import { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe("Portfolio Service", () => {  
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
        await populatePortfoliosInTestDb(testPortfolios);
        done();
    });

    afterAll(async (done) => {
        await cleanupDb();
        await mongoDatabase.disconnect();
        await mongod.stop();
        done();
    });

    it("gets a portfolio by id", async (done) => { 
        let portfolio = await portfolioService.get(testPortfolios[0]._id.toHexString());
        expect(portfolio).toEqual(testPortfolios[0]);
        done();
    });

    it("gets a portfolio by one AND more fields", async (done) => {
        let portfolio = await portfolioService.getByFields({
            name: testPortfolios[0].name,
            funds: []
        });

        expect(portfolio).toEqual(null);

        portfolio = await portfolioService.getByFields({
            name: testPortfolios[0].name,
            funds: testPortfolios[0].funds
        });

        expect(portfolio).toEqual(testPortfolios[0]);
        done();
     });

     it("gets all portfolios", async (done) => {
        const portfolios = await portfolioService.getAll();
        portfolios.forEach((portfolio: IPortfolio, index: number) => {
            expect(portfolio).toEqual(testPortfolios[index]);
        });
        done();
    });

    it("gets a portfolio by one OR more fields", async (done) => { 
        let portfolio = await portfolioService.getByEitherFields(
            [
                { name: testPortfolios[0].name },
                { funds: [] }
            ]);

        expect(portfolio).toEqual(testPortfolios[0]);

        portfolio = await portfolioService.getByEitherFields(
            [
                { name: 'randomname' },
                { funds: testPortfolios[1].funds }
            ]);

        expect(portfolio).toEqual(testPortfolios[1]);
        done();
    });

    it("gets all portfolios by one AND more fields", async (done) => { 
        const portfolios = await portfolioService.getAllByFields({funds: testPortfolios[1].funds});
        expect(portfolios.length).toEqual(1);
        expect(portfolios[0].funds).toEqual(testPortfolios[1].funds);
        done();
    });

    it("creates a portfolio", async (done) => { 
        const portfolioToCreate = {
            name: "newPortfolio",
            funds: [
                {
                    _id: Types.ObjectId(),
                    symbol: "VTI",
                    portfolioPercentage: "80"
                },
                {
                    _id: Types.ObjectId(),
                    symbol: "VXUS",
                    portfolioPercentage: "20"
                }
            ],
            user: Types.ObjectId()
        } as unknown as IPortfolio

        const result = await portfolioService.create(portfolioToCreate);
        const portfolio = result.toObject();

        expect(portfolio.name).toEqual(portfolioToCreate.name);
        expect(portfolio.funds).toEqual(portfolioToCreate.funds);
        expect(portfolio.user).toEqual(portfolioToCreate.user);

        const portfolioFromDb = await portfolioService.get(portfolio._id);

        expect(portfolioFromDb.name).toEqual(portfolioToCreate.name);
        expect(portfolioFromDb.funds).toEqual(portfolioToCreate.funds);
        expect(portfolioFromDb.user).toEqual(portfolioToCreate.user);

        done();
    });

    it("updates a portfolio", async (done) => { 
        const newUser = Types.ObjectId();
        const portfolioToUpdate = {
            _id: testPortfolios[0]._id,
            name: 'newrandomname',
            user: newUser
        } as unknown as IPortfolio

        await portfolioService.update(portfolioToUpdate);
        const updatedPortfolio = await portfolioService.get(testPortfolios[0]._id.toHexString());

        expect(updatedPortfolio.name).not.toEqual(testPortfolios[0].name);
        expect(updatedPortfolio.user).not.toEqual(testPortfolios[0].user);

        expect(updatedPortfolio.name).toEqual('newrandomname');
        expect(updatedPortfolio.user).toEqual(newUser);
        expect(updatedPortfolio.funds).toEqual(testPortfolios[0].funds);
        done();
    });

    it("deletes a portfolio", async (done) => { 
        await portfolioService.delete(testPortfolios[0]._id.toHexString());

        const deletedUser = await portfolioService.get(testPortfolios[0]._id.toHexString());
        expect(deletedUser).toBeNull();
        done();
    });
});