import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const PricePerCaratChart = ({
  data,
  dimensions = { width: "100%", height: "500px" },
  onClick,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Process data - calculate average price per carat by time period
    const processedData = data.reduce((acc, item) => {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          totalPricePerCarat: 0,
          count: 0,
        };
      }

      acc[monthYear].totalPricePerCarat += item.PricePerCarat || 0;
      acc[monthYear].count += 1;

      return acc;
    }, {});

    // Sort time periods and calculate averages
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    const averagePrices = timePeriods.map(period => 
      (processedData[period].totalPricePerCarat / processedData[period].count).toFixed(2)
    );

    const option = {
      title: {
        text: "Average Price Per Carat ($)",
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
            <div>Avg Price: $${value} per carat</div>
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
        name: "Price Per Carat ($)",
        axisLabel: {
          formatter: "${value}",
        },
      },
      series: [
        {
          name: "Price Per Carat",
          type: "line",
          smooth: true,
          data: averagePrices,
          lineStyle: {
            width: 3,
            color: "#c23531",
          },
          symbolSize: 8,
          itemStyle: {
            color: "#c23531",
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

export default PricePerCaratChart;