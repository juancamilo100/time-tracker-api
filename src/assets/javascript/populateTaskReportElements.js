const invoiceEnvVarNames = {
    employeeName: 'TASK_REPORT_EMPLOYEE_NAME',
}

const variableMapping = [
    {
        elementId: "employee-name",
        envVarName: invoiceEnvVarNames.invoiceCustomerName
    },
]

window.onload = (event) => {
    for (let i = 0; i < variableMapping.length; i++) {
        let element = document.getElementById(variableMapping[i].elementId);
        element.innerHTML = window.env[variableMapping[i].envVarName];
    }
};
