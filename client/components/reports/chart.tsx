"use strict";
import * as React from 'react';
import { LineChart, Line, Legend, ResponsiveContainer, XAxis } from "recharts";


interface ReportsChartProps extends React.ComponentProps<any> {
  chartData: Array<object>;
  legend: Array<{dataKey: string, color: string, label: string}>;
  height: Number;
  axisProperty: string
}

export class ReportsChart extends React.Component<ReportsChartProps, any> {
  render() {
    const lines = this.props.legend.map( it =>
      <Line 
        key={it.label}
        dataKey={it.dataKey}
        stroke={it.color}
        strokeWidth="2"
        legendType="line"
        dot={false}
        name={it.label}
      />
    );

    return (
      <ResponsiveContainer width="100%" height={this.props.height}>
        <LineChart
          data={this.props.chartData}
          margin={{left: 30, right: 30}}
        >

          <Legend 
            verticalAlign="top"
            align="left"
            height={16}
            iconType="rect"
          />

          {lines}

          <XAxis
            dataKey={this.props.axisProperty}
            axisLine={false}
            tickLine={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
