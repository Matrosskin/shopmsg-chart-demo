"use strict";
import * as React from 'react';
import { Card } from 'antd';
import moment from "moment";

import { ReportsFilterForm } from './filter-form';
import { ReportsChart } from './chart';


export class ReportWithChart extends React.Component {
  static STATE_READY = "READY";
  static STATE_FETCHING = "FETCHING";

  static CHART_LABEL_OPTINS = "Optins"
  static CHART_COLOR_OPTINS = "blue"
  static CHART_LABEL_RECIPIENTS = "Recipients"
  static CHART_COLOR_RECIPIENTS = "red"

  state = {
    status: ReportWithChart.STATE_FETCHING,
    chartData: [],
    legend: [],
    initialFilterParams: {
      dateRange: [
        moment().subtract(10, "days"),
        moment()
      ],
      optinsEnabled: true,
      recipientsEnabled: true
    }
  };

  componentDidMount() {
    this.fetchData(this.state.initialFilterParams);
  }

  fetchData = (filterParams: {optinsEnabled: boolean, recipientsEnabled: boolean, dateRange: Array<any>}) => {
    this.setState({
      status: ReportWithChart.STATE_FETCHING
    });

    let requests: Array<any> = [];
    let legend: Array<{
      dataKey: string, // path in report item to the value whichh will be used in chart
      color: string, // simple color indentifier - color name or HEX
      label: string
    }> = [];

    const sendRequest = (reportParams: {reportType: string, color: string, label: string}) => {
      let dataItemIndex = legend.length;
      legend.push({
        dataKey: `reports.${dataItemIndex}.count`,
        color: reportParams.color,
        label: reportParams.label
      });

      let fromDate = filterParams.dateRange[0].format("YYYY-MM-DD");
      let toDate = filterParams.dateRange[1].format("YYYY-MM-DD");
      requests.push(
        fetch(`/api/reports/${reportParams.reportType}.json?from=${fromDate}&to=${toDate}`)
      );
    }

    if (filterParams.optinsEnabled) {
      sendRequest({
        reportType: "optins",
        color: ReportWithChart.CHART_COLOR_OPTINS,
        label: ReportWithChart.CHART_LABEL_OPTINS
      });
    }

    if (filterParams.recipientsEnabled) {
      sendRequest({
        reportType:"recipients",
        color: ReportWithChart.CHART_COLOR_RECIPIENTS,
        label: ReportWithChart.CHART_LABEL_RECIPIENTS
      });
    }
    
    Promise.all(requests)
    .then( responses => Promise.all( responses.map( res => res.json() ) ) )
    .then((responsesJSON) => {
      let chartData: Array<any> = [];

      const amountOfReports = responsesJSON.length;
      if (!amountOfReports) {
        this.setState({
          chartData,
          legend,
          status: ReportWithChart.STATE_READY
        })
        return;
      }
      
      // NOTE: Chart accepts one array with all data so we need to merge reports.
      responsesJSON[0].forEach((it: any, index: number) => {
        let chartItem = {
          reports: [] as Array<any>,
          date: it.date
        };
        for(let i = 0; i < amountOfReports; i++) {
          chartItem.reports.push(responsesJSON[i][index]);
        }
        chartData.push(chartItem);
      });

      this.setState({
        chartData,
        legend,
        status: ReportWithChart.STATE_READY
      });
    });
  }

  render() {
    let chart: any = "No data to show chart. Please, try another filter parameters.";
    if (this.state.status == ReportWithChart.STATE_FETCHING) {
      chart = "Loading...";
    } else if (this.state.chartData.length) {
      chart = (
        <ReportsChart
          chartData={this.state.chartData}
          legend={this.state.legend}
          axisProperty="date"
          height={400}
        />
      );
    }

    return (
      <div>
        <Card>
          <ReportsFilterForm
            onChange={this.fetchData}
            filterParams={this.state.initialFilterParams}
          />
        </Card>
        <Card style={{ marginTop: 16 }}>
          {chart}
        </Card>
      </div>
    );
  }
}
