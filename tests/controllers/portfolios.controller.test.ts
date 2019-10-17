import PortfoliosController from '../../src/controllers/portfolios.controller'
import portfolioService from '../../src/services/portfolio.service'
import { IPortfolio } from '../../src/models/portfolio';
import { testPortfolios } from '../utils/mockData'

describe("Users Controller", () => {  
    let portfolioController: PortfoliosController;
    let res: any;
    let nextFunction: any;

    beforeAll(() => {
        portfolioController = new PortfoliosController(portfolioService);
        res = {
            send: jest.fn()
        };
        nextFunction = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    it("gets all portfolios for the current user", async () => { 
        portfolioService.getAllByFields = jest.fn().mockImplementation(() => {
            return Promise.resolve(testPortfolios);
        });

        const req: any = jest.fn();
        
        await portfolioController.getPortfolios(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith(testPortfolios);
    });

    it("gets a portfolio by id", async () => { 
        portfolioService.get = jest.fn().mockImplementation(() => {
            return Promise.resolve(testPortfolios[0]);
        });

        const req: any = {
            params: {
                id: '1234',
            }
        }

        await portfolioController.getPortfolioById(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith(testPortfolios[0]);
    });

    it("creates a new portfolio under the current user's id", async () => { 
        const currentUserId = '5cfafb0ccfe7761d47af53b3'
        const newPortfolio = {
            funds: [
                {
                    _id: "5d2fc59aae6b9816488dcf30",
                    symbol: "VTI",
                    portfolioPercentage: "90"
                },
                {
                    _id: "5d2fc59aae6b9816488dcf31",
                    symbol: "VXUS",
                    portfolioPercentage: "10"
                }
            ],
            name: "SomePortfolio",
        }
        
        const req: any = {
            body: newPortfolio,
            userId: currentUserId
        }

        const createdPortfolio = {
            funds: newPortfolio.funds,
            name: newPortfolio.name,
            user: currentUserId
        }
        
        portfolioService.create = jest.fn().mockImplementation((portfolio: IPortfolio) => {
            return Promise.resolve(portfolio);
        });

        await portfolioController.createPortfolio(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith(createdPortfolio);
    });

    it("doesn't create a new portfolio with undefined funds field", async () => { 
        const currentUserId = '5cfafb0ccfe7761d47af53b3'
        const newPortfolio = {
            name: "SomePortfolio",
        }

        const req: any = {
            body: newPortfolio,
            userId: currentUserId
        }

        portfolioService.create = jest.fn().mockImplementation((portfolio: IPortfolio) => {
            return Promise.resolve(portfolio);
        });

        await portfolioController.createPortfolio(req, res, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it("creates a portfolio with no funds", async () => { 
        const currentUserId = '5cfafb0ccfe7761d47af53b3'
        const newPortfolio = {
            name: "SomePortfolio",
            funds: []
        }

        const req: any = {
            body: newPortfolio,
            userId: currentUserId
        }

        const createdPortfolio = {
            funds: newPortfolio.funds,
            name: newPortfolio.name,
            user: currentUserId
        }

        portfolioService.create = jest.fn().mockImplementation((portfolio: IPortfolio) => {
            return Promise.resolve(portfolio);
        });

        await portfolioController.createPortfolio(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith(createdPortfolio);
    });

    it("doesn't create a portfolio when its fund allocation doesn't amount to 100%", async () => { 
        const currentUserId = '5cfafb0ccfe7761d47af53b3'
        const newPortfolio = {
            name: "SomePortfolio",
            funds: [
                {
                    _id: "5d2fc59aae6b9816488dcf30",
                    symbol: "VTI",
                    portfolioPercentage: "80"
                },
                {
                    _id: "5d2fc59aae6b9816488dcf31",
                    symbol: "VXUS",
                    portfolioPercentage: "10"
                }
            ],
        }

        const req: any = {
            body: newPortfolio,
            userId: currentUserId
        }

        await portfolioController.createPortfolio(req, res, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it("updates a portfolio", async () => { 
        portfolioService.update = jest.fn().mockImplementation(() => {
            return Promise.resolve(testPortfolios[0]);
        });

        const req: any = {
            params: {
                id: '1234',
            },
            body: { 
                updatedFields: {
                    name: "SomePortfolioToUpdate",
                    funds: [
                        {
                            _id: "5d2fc59aae6b9816488dcf30",
                            symbol: "VTI",
                            portfolioPercentage: "100"
                        }
                    ]
                }
            }   
        }

        await portfolioController.updatePorfolio(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith({ _id: testPortfolios[0]._id });
    });

    it("updates a portfolio with partial changes", async () => { 
        portfolioService.update = jest.fn().mockImplementation(() => {
            return Promise.resolve(testPortfolios[0]);
        });

        let req: any = {
            params: {
                id: '1234',
            },
            body: { 
                updatedFields: {
                    name: "SomePortfolioToUpdate",
                }
            }   
        }

        await portfolioController.updatePorfolio(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith({ _id: testPortfolios[0]._id });
        
        req = {
            params: {
                id: '1234',
            },
            body: { 
                updatedFields: {
                    funds: [
                        {
                            _id: "5d2fc59aae6b9816488dcf30",
                            symbol: "VXUS",
                            portfolioPercentage: "100"
                        }
                    ]
                }
            }   
        }

        await portfolioController.updatePorfolio(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith({ _id: testPortfolios[0]._id });
    });

    it("doesn't update a portfolio if new fund allocation doesn't add up to 100%", async () => { 
        portfolioService.update = jest.fn().mockImplementation(() => {
            return Promise.resolve(testPortfolios[0]);
        });

        const req: any = {
            params: {
                id: '1234',
            },
            body: { 
                updatedFields: {
                    name: "SomePortfolioToUpdate",
                    funds: [
                        {
                            _id: "5d2fc59aae6b9816488dcf30",
                            symbol: "VTI",
                            portfolioPercentage: "80"
                        },
                        {
                            _id: "5d2fc59aae6b9816488dcf30",
                            symbol: "VXUS",
                            portfolioPercentage: "10"
                        }
                    ]
                }
            }   
        }

        await portfolioController.updatePorfolio(req, res, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it("deletes a portfolio by id", async () => { 
        portfolioService.delete = jest.fn().mockImplementation(() => {
            return Promise.resolve(testPortfolios[0]);
        });

        const req: any = {
            params: {
                id: testPortfolios[0]._id,
            }
        }

        await portfolioController.deletePortfolio(req, res, nextFunction);
        expect(res.send).toHaveBeenCalledWith(testPortfolios[0]);
    });
});