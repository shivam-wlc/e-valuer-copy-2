import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const TotalValueChart = ({
  data,
  dimensions = { width: "100%", height: "500px" },
  onClick,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Process data - sum total value by time period
    const processedData = data.reduce((acc, item) => {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }

      acc[monthYear] += item.TotalPrice || 0;

      return acc;
    }, {});

    // Sort time periods
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    const totalValues = timePeriods.map(
      (period) => (processedData[period] / 1000).toFixed(2) // Convert to thousands for better display
    );

    const option = {
      title: {
        text: "Total Value (in $ thousands)",
        top: 0,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const period = params[0].axisValue;
          const value = params[0].value;
          return `
            <div style="font-weight:bold">${period}</div>
            <div>Total Value: $${(value * 1000).toLocaleString()}</div>
          `;
        },
      },
      legend: {
        show: false,
      },
      grid: {
        top: 80,
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: timePeriods,
        name: "Time Period",
        nameLocation: "middle",
        nameGap: 25,
        axisLabel: {
          rotate: timePeriods.length > 6 ? 45 : 0,
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Total Value ($ thousands)",
        axisLabel: {
          formatter: "${value}k",
        },
      },
      series: [
        {
          name: "Total Value",
          type: "line",
          smooth: true,
          data: totalValues,
          lineStyle: {
            width: 3,
            color: "#2f4554",
          },
          symbolSize: 8,
          itemStyle: {
            color: "#2f4554",
          },
        },
      ],
    };

    chart.setOption(option);

    // Handle resize
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: dimensions.width, height: dimensions.height }}
    />
  );
};

export default TotalValueChart;
