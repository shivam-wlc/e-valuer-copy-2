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
        acc[monthYear] = {};
      }

      const qualityKey = `${item.Quality}` || "Unknown";

      if (!acc[monthYear][qualityKey]) {
        acc[monthYear][qualityKey] = {
          count: 0,
          totalPricePerCarat: 0,
          items: 0,
        };
      }

      acc[monthYear][qualityKey].count += item.StoneCount || 1;
      acc[monthYear][qualityKey].totalPricePerCarat += item.PricePerCarat || 0;
      acc[monthYear][qualityKey].items += 1;

      return acc;
    }, {});

    // Get sorted time periods and quality levels
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const qualities = [
      ...new Set(data.map((item) => `${item.Quality}` || "Unknown")),
    ].sort();

    // Prepare series data
    const seriesData = qualities.map((quality) => ({
      name: quality,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: timePeriods.map((period) => {
        const qualityData = processedData[period][quality];
        return qualityData ? qualityData.count : 0;
      }),
      tooltip: {
        valueFormatter: (value) => `${value} items`,
      },
    }));

    // Prepare tooltip formatter
    const tooltipFormatter = (params) => {
      const timePeriod = params[0].axisValue;
      let result = `<div style="font-weight:bold;margin-bottom:5px">${timePeriod}</div>`;

      params.forEach((param) => {
        const quality = param.seriesName;
        const count = param.value;

        result += `
          <div style="display:flex;align-items:center;margin:5px 0">
            <div style="width:10px;height:10px;background:${param.color};margin-right:5px"></div>
            ${quality}: ${count} 
          </div>
        `;
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
        name: "Count",
        axisLabel: {
          formatter: "{value}",
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
