const variableMapping = [
    {
        elementId: "customer-name",
        envVarName: envVarNames.invoiceCustomerName
    },
    {
        elementId: "customer-address-line-1",
        envVarName: envVarNames.invoiceCustomerAddressLine1
    },
    {
        elementId: "customer-address-line-2",
        envVarName: envVarNames.invoiceCustomerAddressLine2
    },
    {
        elementId: "customer-address-line-3",
        envVarName: envVarNames.invoiceCustomerAddressLine3
    },
    {
        elementId: "invoice-number",
        envVarName: envVarNames.invoiceNumber
    },
    {
        elementId: "date",
        envVarName: envVarNames.invoiceDate
    },
    {
        elementId: "due-date",
        envVarName: envVarNames.invoiceDueDate
    },
    {
        elementId: "terms",
        envVarName: envVarNames.invoiceTerms
    },
    {
        elementId: "description-list",
        envVarName: envVarNames.invoiceDescriptionList
    },
    {
        elementId: "quantity-list",
        envVarName: envVarNames.invoiceQuantityList
    },
    {
        elementId: "rate-list",
        envVarName: envVarNames.invoiceRateList
    },
    {
        elementId: "amount-list",
        envVarName: envVarNames.invoiceAmountList
    },
    {
        elementId: "invoice-total",
        envVarName: envVarNames.invoiceTotal
    },
]

for (let i = 0; i < variableMapping.length; i++) {
    let element = document.getElementById(variableMapping[i].elementId);
    element.innerHTML = window.env[variableMapping[i].envVarName];
}