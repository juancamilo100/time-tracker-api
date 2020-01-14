const hourlyReportEnvVarNames = {
    employeeName: 'HOURLY_REPORT_EMPLOYEE_NAME',
    reportPeriod: 'HOURLY_REPORT_PERIOD',
    tableRows: 'HOURLY_REPORT_TABLE_ROWS',
    totalHours: 'HOURLY_REPORT_TOTAL_HOURS',
}

const variableMapping = [
    {
        elementId: "employee-name",
        envVarName: hourlyReportEnvVarNames.employeeName
    },
    {
        elementId: "report-period",
        envVarName: hourlyReportEnvVarNames.reportPeriod
    },
    {
        elementId: "table-rows",
        envVarName: hourlyReportEnvVarNames.tableRows
    },
    {
        elementId: "total-hours",
        envVarName: hourlyReportEnvVarNames.totalHours
    },
]

window.onload = (event) => {
    for (let i = 0; i < variableMapping.length; i++) {
        let element = document.getElementById(variableMapping[i].elementId);
        element.innerHTML = window.env[variableMapping[i].envVarName];
    }
};
