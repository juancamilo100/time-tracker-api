import { invoiceEnvVarNames } from '../services/invoice.service';

const variableMapping = [
    {
        elementId: "customer-name",
        envVarName: invoiceEnvVarNames.invoiceCustomerName
    },
    {
        elementId: "customer-address-line-1",
        envVarName: invoiceEnvVarNames.invoiceCustomerAddressLine1
    },
    {
        elementId: "customer-address-line-2",
        envVarName: invoiceEnvVarNames.invoiceCustomerAddressLine2
    },
    {
        elementId: "customer-address-line-3",
        envVarName: invoiceEnvVarNames.invoiceCustomerAddressLine3
    },
    {
        elementId: "invoice-number",
        envVarName: invoiceEnvVarNames.invoiceNumber
    },
    {
        elementId: "date",
        envVarName: invoiceEnvVarNames.invoiceDate
    },
    {
        elementId: "due-date",
        envVarName: invoiceEnvVarNames.invoiceDueDate
    },
    {
        elementId: "terms",
        envVarName: invoiceEnvVarNames.invoiceTerms
    },
    {
        elementId: "description-list",
        envVarName: invoiceEnvVarNames.invoiceDescriptionList
    },
    {
        elementId: "quantity-list",
        envVarName: invoiceEnvVarNames.invoiceQuantityList
    },
    {
        elementId: "rate-list",
        envVarName: invoiceEnvVarNames.invoiceRateList
    },
    {
        elementId: "amount-list",
        envVarName: invoiceEnvVarNames.invoiceAmountList
    },
    {
        elementId: "invoice-total",
        envVarName: invoiceEnvVarNames.invoiceTotal
    },
]

for (let i = 0; i < variableMapping.length; i++) {
    let element = document.getElementById(variableMapping[i].elementId);
    element!.innerHTML = window.env[variableMapping[i].envVarName];
}