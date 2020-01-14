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
        elementId: "table",
        envVarName: hourlyReportEnvVarNames.tableRows
    }
]

const getTableFooter = () =>     
    `<div class="total-row title-text">
        <tr class="total-row title-text">
            <td colspan="2">Total Hours</td>
            <td>${window.env[hourlyReportEnvVarNames.totalHours]}</td>
        </tr>
    </div>`

window.onload = (event) => {
    for (let i = 0; i < variableMapping.length; i++) {
        let element = document.getElementById(variableMapping[i].elementId);
        element.innerHTML += window.env[variableMapping[i].envVarName];
    }

    let table = document.getElementById('table');
    table.innerHTML += getTableFooter();
};


