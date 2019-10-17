import { IFund } from "../../src/models/portfolio";
import FundDetailsService from '../../src/services/fund.service'
import { STOCKS_API_TOKEN, STOCKS_API_BASE_URL } from '../../config'
import { testFunds } from '../utils/mockData'

describe("Fund Service", () => {  
    let fundDetailsService: FundDetailsService;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        fundDetailsService = new FundDetailsService(STOCKS_API_BASE_URL, STOCKS_API_TOKEN);
    });

    it("gets an individual fund details", async () => { 
        const details = await fundDetailsService.getFundDetails(testFunds[0]);
        expect(details.symbol).toEqual(testFunds[0].symbol);
    });

    it("gets details of an array of funds", async () => { 
        const details = await fundDetailsService.getFundsDetails(testFunds);
        testFunds.forEach((fund, index) => {
            expect(details[index].symbol).toEqual(fund.symbol);
        })
    });

});