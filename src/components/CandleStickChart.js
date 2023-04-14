import React, { useRef, useEffect, useState } from 'react';
import Utils from "../Utils/common";
import ApexCharts from 'apexcharts';

function CandleStickChart() {
  const chartRef = useRef(null);
  const initialChartData = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'Candlestick Chart Demo'
    },
    series: [{
      data: [],
    }],
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }

  const [chartOptions, setChartOptions] = useState(initialChartData);
  
  useEffect(() => {
    getCandleStickData();
    setInterval(() => {
      getCandleStickData();
    }, 10000);
  }, []);
  
  const getCandleStickData = async () => {
    let endTime = new Date();
    let startTime = endTime.setHours(endTime.getHours() - 1);
    const response = await fetch(`
      https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=5m&limit=50
    `, {
      method: 'GET',
      headers: {
        Accept: "application/json",
      },
      referrer: "no-referrer",
      redirect: "follow",
    });
    
    const resultData = await response.json();
    const newSeriesData = [];
    for (let item of resultData) {
      newSeriesData.push({
        x: new Date(item[6]),
        y: [item[1], item[2], item[3], item[4]]
      });
    }
    const cloneChartOptions = Utils.cloneDeep(chartOptions);
    cloneChartOptions.series = [{data: newSeriesData}];
    setChartOptions(cloneChartOptions);
  }

  useEffect(() => {
    if (Object.keys(chartOptions).length !== 0) {
      const chart = new ApexCharts(chartRef.current, chartOptions);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [chartOptions]);

  return (
    <div ref={chartRef}></div>
  );
}

export default CandleStickChart;
