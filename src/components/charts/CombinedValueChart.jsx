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

    // Process data for price per carat metric
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

    // Calculate percentage changes for series
    const pricePerCaratChanges = averagePrices.map((val, idx, arr) => {
      if (idx === 0) return null;
      const prev = parseFloat(arr[idx - 1]);
      const curr = parseFloat(val);
      if (prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    });

    // Prepare visual data with colors
    const pricePerCaratVisualData = [];

    // For price per carat
    for (let i = 0; i < averagePrices.length; i++) {
      if (i === 0) {
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

    const option = {
      title: {
        text: "$ / Carat",
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

          // Process the $/Carat series
          const param = params[0];

          if (param) {
            const idx = param.dataIndex;
            let changeText = "";

            if (idx > 0) {
              const change = pricePerCaratChanges[idx];

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
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:5px"></span>
                $/Carat: $${param.value}
                ${changeText}
              </div>
            `;
          }

          return tooltip;
        },
      },
      legend: {
        data: ["$/Carat"],
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
      yAxis: {
        type: "value",
        name: "$/Carat",
        axisLabel: {
          formatter: "${value}",
        },
      },
      series: [
        {
          name: "$/Carat",
          type: "line",
          smooth: true,
          data: pricePerCaratVisualData,
          lineStyle: {
            width: 3,
          },
          symbolSize: 8,
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
