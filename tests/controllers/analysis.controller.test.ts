import FundDetailsService from '../../src/services/fund.service';
import portfolioService from '../../src/services/portfolio.service';
import { PortfolioAnalysisService } from '../../src/services/analysis.service';
import AnalysisController from '../../src/controllers/analysis.controller';
import { STOCKS_API_TOKEN, STOCKS_API_BASE_URL } from '../../config'
import { fundAnalysisMockData, fundDetailsMockData, testPortfolios } from '../utils/mockData';

describe("Auth Controller", () => {  
    let analysisController: AnalysisController;
    let fundDetailsService: FundDetailsService;
    let analysisService: PortfolioAnalysisService;
    let res: any;
    let nextFunction: any;
    
    beforeAll(() => {
        fundDetailsService = new FundDetailsService(STOCKS_API_BASE_URL, STOCKS_API_TOKEN);
        analysisService = new PortfolioAnalysisService();

        analysisService.getFundsAnalysis = jest.fn().mockImplementation(() => {})
        fundDetailsService.getFundDetails = jest.fn().mockImplementation(() => Promise.resolve(fundDetailsMockData));
        portfolioService.get = jest.fn().mockImplementation(() => Promise.resolve(testPortfolios[0]));

        analysisController = new AnalysisController(fundDetailsService, portfolioService, analysisService);
        
        res = {
            send: jest.fn()
        };

        nextFunction = jest.fn();
    });

    it("throws error if target investment is less than zero", async () => {
        const req: any = {
            params: {
                targetInvestment: -10
            }
        }

        await analysisController.getPortfolioAnalysis(req, res, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it("throws error if target investment is ", async () => { 
        const recommendedInvestmentAmountMockData = 1050;
        const req: any = {
            params: {
                targetInvestment: 1000
            },
        }

        analysisService.getFundsAnalysis = jest.fn().mockImplementation(() => fundAnalysisMockData);
        analysisService.getRecommendedInvestmentAmount = jest.fn().mockImplementation(() => recommendedInvestmentAmountMockData);

        await analysisController.getPortfolioAnalysis(req, res, nextFunction);

        expect(res.send).toHaveBeenCalledWith({
            analysis: fundAnalysisMockData,
            recommendedInvestmentAmount: recommendedInvestmentAmountMockData
        });
    });

});
