import { PortfolioAnalysisService } from '../../src/services/analysis.service'
import { analysisMockData } from '../utils/mockData';

describe("Fund Service", () => {  
    let portfolioAnalysisService: PortfolioAnalysisService;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        portfolioAnalysisService = new PortfolioAnalysisService();
    });

    test("resulting values from fund analysis add up", () => { 
        const analysisResults = portfolioAnalysisService.getFundsAnalysis(analysisMockData);

        let totalMoneyInvested: number = 0;
        analysisResults.allocation.forEach((analysis) => {
            totalMoneyInvested += analysis.moneyInvested;
        })

        expect(totalMoneyInvested).toEqual(analysisResults.totalMoneyInvested);
        expect(analysisMockData.targetInvestment).toEqual(analysisResults.moneyLeftover + analysisResults.totalMoneyInvested);
    });

    test("recommended investment amount should not be more than target plus default tolerance", () => { 
        for (let i = 0; i < 10; i++) {
            const targetInvestment = Math.floor(Math.random()*10000);
            let tempAnalysisMockData = {
                ...analysisMockData,
                targetInvestment 
            }
            const recommendedInvestmentAmount = portfolioAnalysisService.getRecommendedInvestmentAmount(tempAnalysisMockData);
            expect(recommendedInvestmentAmount).toBeLessThanOrEqual(targetInvestment + 500);
        }
    });
});