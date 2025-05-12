import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const CombinedValueChart = ({
  data,
  dimensions = { width: "100%", height: "500px" },
  onClick,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Process data for both metrics
    const pricePerCaratData = data.reduce((acc, item) => {
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

    const totalValueData = data.reduce((acc, item) => {
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
    const timePeriods = Object.keys(pricePerCaratData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });

    // Prepare series data
    const averagePrices = timePeriods.map((period) =>
      (
        pricePerCaratData[period].totalPricePerCarat /
        pricePerCaratData[period].count
      ).toFixed(2)
    );

    const totalValues = timePeriods.map(
      (period) => (totalValueData[period] / 1000).toFixed(2) // Convert to thousands
    );

    // Calculate percentage changes for both series
    const pricePerCaratChanges = averagePrices.map((val, idx, arr) => {
      if (idx === 0) return null;
      const prev = parseFloat(arr[idx - 1]);
      const curr = parseFloat(val);
      if (prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    });

    const totalValueChanges = totalValues.map((val, idx, arr) => {
      if (idx === 0) return null;
      const prev = parseFloat(arr[idx - 1]);
      const curr = parseFloat(val);
      if (prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    });

    // Prepare visual data with colors
    const pricePerCaratVisualData = [];
    const totalValueVisualData = [];

    // For price per carat
    for (let i = 0; i < averagePrices.length; i++) {
      if (i === 0) {
        // pricePerCaratVisualData.push(averagePrices[i]);

        const color = "#008080"; // Teal color for the first point
        pricePerCaratVisualData.push({
          value: averagePrices[i],
          itemStyle: {
            color: color, // Default teal color for first point
          },
          label: {
            show: true,
            formatter: `$${parseFloat(averagePrices[i]).toLocaleString()}`,
            backgroundColor: "#000000",
            padding: [4, 8],
            borderRadius: 4,
            color: "#FFFFFF",
            fontWeight: "bold",
          },
        });
      } else {
        const change = pricePerCaratChanges[i];
        const color = change >= 0 ? "#4CAF50" : "#F44336";
        pricePerCaratVisualData.push({
          value: averagePrices[i],
          itemStyle: {
            color: color,
          },
        });
      }
    }

    // For total value
    for (let i = 0; i < totalValues.length; i++) {
      if (i === 0) {
        // totalValueVisualData.push(totalValues[i]);
        const color = "#008080"; // Teal color for the first point
        totalValueVisualData.push({
          value: totalValues[i],
          itemStyle: {
            color: color, // Default teal color for first point
          },
          label: {
            show: true,
            formatter: `$${(
              parseFloat(totalValues[i]) * 1000
            ).toLocaleString()}`,
            backgroundColor: "#000000",
            padding: [4, 8],
            borderRadius: 4,
            color: "#FFFFFF",
            fontWeight: "bold",
          },
        });
      } else {
        const change = totalValueChanges[i];
        const color = change >= 0 ? "#4CAF50" : "#F44336";
        totalValueVisualData.push({
          value: totalValues[i],
          itemStyle: {
            color: color,
          },
        });
      }
    }

    const option = {
      title: {
        text: "$ / Carat & Total Value",
        top: 0,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        formatter: function (params) {
          let tooltip = `<div style="font-weight:bold">${params[0].axisValue}</div>`;

          params.forEach((param) => {
            const idx = param.dataIndex;
            let changeText = "";

            if (idx > 0) {
              const change =
                param.seriesIndex === 0
                  ? pricePerCaratChanges[idx]
                  : totalValueChanges[idx];

              if (change !== null) {
                const sign = change >= 0 ? "+" : "";
                const color = change >= 0 ? "#4CAF50" : "#F44336";
                changeText = `<span style="color:${color};margin-left:8px">(${sign}${change.toFixed(
                  2
                )}%)</span>`;
              }
            }

            tooltip += `
              <div style="margin-top:4px">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${
                  param.color
                };margin-right:5px"></span>
                ${param.seriesName}: ${
              param.seriesIndex === 1
                ? `$${(parseFloat(param.value) * 1000).toLocaleString()}`
                : `$${param.value}`
            }
                ${changeText}
              </div>
            `;
          });

          return tooltip;
        },
      },
      legend: {
        data: ["$/Carat", "Total Value ($ thousands)"],
        top: 30,
      },
      grid: {
        top: 100,
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
      yAxis: [
        {
          type: "value",
          name: "$/Carat",
          position: "left",
          axisLabel: {
            formatter: "${value}",
          },
        },
        {
          type: "value",
          name: "Total Value ($ thousands)",
          position: "right",
          axisLabel: {
            formatter: "${value}k",
          },
        },
      ],
      series: [
        {
          name: "$/Carat",
          type: "line",
          smooth: true,
          data: pricePerCaratVisualData,
          yAxisIndex: 0,
          lineStyle: {
            width: 3,
            // color: "#c23531",
          },
          symbolSize: 8,
          itemStyle: {
            // color: "#c23531",
            // width: 2,
          },
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              const idx = params.dataIndex;
              if (idx === 0) return "";
              const change = pricePerCaratChanges[idx];
              if (change === null || change === undefined) return "";
              const sign = change >= 0 ? "+" : "";
              return change >= 0
                ? `{increase|${sign}${change.toFixed(2)}%}`
                : `{decrease|${sign}${change.toFixed(2)}%}`;
            },
            rich: {
              increase: {
                fontWeight: "bold",
                fontSize: 12,
                padding: [2, 4],
                borderRadius: 4,
                backgroundColor: "#4caf50",
                color: "#fff",
              },
              decrease: {
                fontWeight: "bold",
                fontSize: 12,
                padding: [2, 4],
                borderRadius: 4,
                backgroundColor: "#f44336",
                color: "#fff",
              },
            },
          },
        },
        {
          name: "Total Value ($ thousands)",
          type: "line",
          smooth: true,
          data: totalValueVisualData,
          yAxisIndex: 1,
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: "#008080", // Teal color for the line
          },
          label: {
            show: true,
            position: "bottom",
            formatter: function (params) {
              const idx = params.dataIndex;
              if (idx === 0) return "";
              const change = totalValueChanges[idx];
              if (change === null || change === undefined) return "";
              const sign = change >= 0 ? "+" : "";
              return change >= 0
                ? `{increase|${sign}${change.toFixed(2)}%}`
                : `{decrease|${sign}${change.toFixed(2)}%}`;
            },
            rich: {
              increase: {
                fontWeight: "bold",
                fontSize: 12,
                padding: [2, 4],
                borderRadius: 4,
                backgroundColor: "#4caf50",
                color: "#fff",
              },
              decrease: {
                fontWeight: "bold",
                fontSize: 12,
                padding: [2, 4],
                borderRadius: 4,
                backgroundColor: "#f44336",
                color: "#fff",
              },
            },
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

export default CombinedValueChart;
