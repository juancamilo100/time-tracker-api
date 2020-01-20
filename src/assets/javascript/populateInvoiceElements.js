const invoiceEnvVarNames = {
    invoiceCustomerName: 'INVOICE_CUSTOMER_NAME',
    invoiceCustomerAddressLine1: 'INVOICE_CUSTOMER_ADDRESS_LINE_1',
    invoiceCustomerAddressLine2: 'INVOICE_CUSTOMER_ADDRESS_LINE_2',
    invoiceCustomerAddressLine3: 'INVOICE_CUSTOMER_ADDRESS_LINE_3',
    invoiceNumber: 'INVOICE_NUMBER',
    invoiceDate: 'INVOICE_DATE',
    invoiceDueDate: 'INVOICE_DUE_DATE',
    invoiceTerms: 'INVOICE_TERMS',
    invoiceDescriptionList: 'INVOICE_DESCRIPTION_LIST',
    invoiceQuantityList: 'INVOICE_QUANTITY_LIST',
    invoiceRateList: 'INVOICE_RATE_LIST',
    invoiceAmountList: 'INVOICE_AMOUNT_LIST',
    invoiceTotal: 'INVOICE_TOTAL'
}

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
        elementId: "invoice-subtotal",
        envVarName: invoiceEnvVarNames.invoiceTotal
    },
    {
        elementId: "invoice-total",
        envVarName: invoiceEnvVarNames.invoiceTotal
    },
    {
        elementId: "balance",
        envVarName: invoiceEnvVarNames.invoiceTotal
    }
]

window.onload = (event) => {
    for (let i = 0; i < variableMapping.length; i++) {
        let element = document.getElementById(variableMapping[i].elementId);
        element.innerHTML = window.env[variableMapping[i].envVarName];
    }

    if(!window.env["customer-address-line-2"]) {
        const element = document.getElementById("customer-address-line-2");
        element.parentNode.removeChild(element);
    }
};
