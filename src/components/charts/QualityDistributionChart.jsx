import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const QualityModelBarChart = ({
  data,
  dimensions = { width: "100%", height: "500px" },
  onClick,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Process data - group by month/year and quality
    const processedData = data.reduce((acc, item) => {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          totalValuation: 0,
          qualities: {},
        };
      }

      const qualityKey = `${item.Quality}` || "Unknown";
      const valuation =
        item.TotalPrice || (item.PricePerCarat || 0) * (item.Carats || 0);

      if (!acc[monthYear].qualities[qualityKey]) {
        acc[monthYear].qualities[qualityKey] = {
          valuation: 0,
          carats: 0,
        };
      }

      acc[monthYear].qualities[qualityKey].valuation += valuation;
      acc[monthYear].qualities[qualityKey].carats += item.Carats || 0;
      acc[monthYear].totalValuation += valuation;

      return acc;
    }, {});

    // Get sorted time periods and quality levels
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const qualities = [
      ...new Set(data.map((item) => `${item.Quality}` || "Unknown")),
    ].sort();

    // Prepare series data - now using valuation instead of count
    const seriesData = qualities.map((quality) => ({
      name: quality,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: timePeriods.map((period) => {
        const qualityData = processedData[period].qualities[quality];
        return qualityData ? qualityData.valuation / 1000 : 0; // Convert to thousands
      }),
    }));

    // Prepare tooltip formatter to show valuation and percentage of total valuation
    const tooltipFormatter = (params) => {
      const timePeriod = params[0].axisValue;
      const periodData = processedData[timePeriod];
      let result = `<div style="font-weight:bold;margin-bottom:5px">${timePeriod}</div>`;
      result += `<div>Total Valuation: ${(
        periodData.totalValuation / 1000
      ).toFixed(1)}K</div>`;
      result += `<hr style="margin:5px 0;border-color:#eee"/>`;

      params.forEach((param) => {
        const quality = param.seriesName;
        const valuation = param.value * 1000; // Convert back from thousands
        const qualityData = periodData.qualities[quality];

        if (qualityData) {
          const percentage = (
            (valuation / periodData.totalValuation) *
            100
          ).toFixed(1);

          result += `
            <div style="display:flex;justify-content:space-between;margin:5px 0">
              <div style="display:flex;align-items:center;">
                <div style="width:10px;height:10px;background:${
                  param.color
                };margin-right:5px"></div>
                Quality ${quality}:
              </div>
              <div style="text-align:right">
                ${(valuation / 1000).toFixed(1)}K (${percentage}%)<br/>
              </div>
            </div>
          `;
        }
      });

      return result;
    };

    const option = {
      title: {
        text: "Quality Distribution",
        top: 0,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: tooltipFormatter,
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        type: "scroll",
        top: 30,
        data: qualities,
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
        nameGap: 22,
        axisLabel: {
          rotate: timePeriods.length > 6 ? 45 : 0,
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Valuation ($K)",
        axisLabel: {
          formatter: "{value}K",
        },
      },
      series: seriesData,
      color: [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#91c7ae",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
      ],
    };

    chart.setOption(option);

    // Click event handling
    chart.on("click", (params) => {
      if (onClick && params.seriesType === "bar") {
        onClick({
          quality: Number(params.seriesName),
          timePeriod: params.name,
        });
      }
    });

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

export default QualityModelBarChart;
