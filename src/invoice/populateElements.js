const envVars = require('./invoiceEnvVarNames');

const variableMapping = [
    {
        elementId = 'customer-name',
        envVarName = envVars.invoiceCustomerName
    },
    {
        elementId = 'customer-addres-1',
        envVarName = envVars.invoiceCustomerAddressLine1
    },
    {
        elementId = 'customer-addres-2',
        envVarName = envVars.invoiceCustomerAddressLine2
    },
    {
        elementId = 'customer-addres-3',
        envVarName = envVars.invoiceCustomerAddressLine3
    },
    {
        elementId = 'invoice-number',
        envVarName = envVars.invoiceNumber
    },
    {
        elementId = 'date',
        envVarName = envVars.invoiceDate
    },
    {
        elementId = 'due-date',
        envVarName = envVars.invoiceDueDate
    },
    {
        elementId = 'terms',
        envVarName = envVars.invoiceTerms
    },
    {
        elementId = 'description-list',
        envVarName = envVars.invoiceDescriptionList
    },
    {
        elementId = 'quantity-list',
        envVarName = envVars.invoiceQuantityList
    },
    {
        elementId = 'rate-list',
        envVarName = envVars.invoiceRateList
    },
    {
        elementId = 'amount-list',
        envVarName = envVars.invoiceAmountList
    },
    {
        elementId = 'invoice-total',
        envVarName = envVars.invoiceTotal
    },
]

for (let i = 0; i < variableMapping.length; i++) {
    let element = document.getElementById(variableMapping[i].elementId);
    element.innerHTML = window.env[variableMapping[i].envVarName]; //getUrlParam('name', 'sd');
}