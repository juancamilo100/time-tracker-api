import { Types } from 'mongoose';
import { IFund } from '../../src/models/portfolio';

export const testUsers = [
    {
        _id: Types.ObjectId(),
        username: 'testuser1',
        email: 'testuser1@email.com',
        password: 'somepassword1',
        portfolios: [
            Types.ObjectId(),
            Types.ObjectId()
        ]
    },
    {
        _id: Types.ObjectId(),
        username: 'testuser2',
        email: 'testuser2@email.com',
        password: 'somepassword2',
        portfolios: [
            Types.ObjectId(),
            Types.ObjectId(),
            Types.ObjectId()
        ]
    }
]

export const testUsersWithoutPassword = JSON.parse(JSON.stringify(testUsers))
testUsersWithoutPassword.forEach((user: any) => {
    delete user.password;
});

export const testPortfolios = [
    {
        _id: Types.ObjectId(),
        name: "Portfolio1",
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
        user: Types.ObjectId(),
    },
    {
        _id: Types.ObjectId(),
        name: "Portfolio2",
        funds: [
            {
                _id: Types.ObjectId(),
                symbol: "SCHD",
                portfolioPercentage: "70"
            },
            {
                _id: Types.ObjectId(),
                symbol: "SCHX",
                portfolioPercentage: "30"
            }
        ],
        user: Types.ObjectId(),
    }
];

export const testFunds: IFund[] = [
    {
        symbol: 'VTI',
        portfolioPercentage: '50'
    },
    {
        symbol: 'VXUS',
        portfolioPercentage: '50'
    },
    {
        symbol: 'BND',
        portfolioPercentage: '50'
    }        
];

export const analysisMockData = {
    funds: testFunds, 
    latestPrices: [
        147.34,
        49.82,
        84.83
    ], 
    targetInvestment: 2000
}

export const fundDetailsMockData = {
    fund: "VTI",
    price: 147.34,
    sharesToBuy: 10,
    moneyInvested: 1473.4
}

export const fundAnalysisMockData = {
    allocation: [
        {
            fund: "VTI",
            price: 147.34,
            sharesToBuy: 10,
            moneyInvested: 1473.4
        },
        {
            fund: "VXUS",
            price: 49.82,
            sharesToBuy: 6,
            moneyInvested: 298.92
        },
        {
            fund: "BND",
            price: 84.83,
            sharesToBuy: 1,
            moneyInvested: 84.83
        }
    ],
    totalMoneyInvested: 1857.15,
    moneyLeftover: 142.85
}