import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const SizeDistributionChart = ({
  data,
  dimensions = { width: "100%", height: "500px" },
  onClick,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Process data - group by month/year and size category
    const processedData = data.reduce((acc, item) => {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }

      const sizeKey = item.SizeCategory || item.SizeGroup || "Unknown";

      if (!acc[monthYear][sizeKey]) {
        acc[monthYear][sizeKey] = {
          count: 0,
          totalPricePerCarat: 0,
          items: 0,
        };
      }

      acc[monthYear][sizeKey].count += item.StoneCount || 1;
      acc[monthYear][sizeKey].totalPricePerCarat += item.PricePerCarat || 0;
      acc[monthYear][sizeKey].items += 1;

      return acc;
    }, {});

    // Get sorted time periods and sizes
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const sizes = [
      ...new Set(
        data.map((item) => item.SizeCategory || item.SizeGroup || "Unknown")
      ),
    ].sort();

    // Prepare series data
    const seriesData = sizes.map((size) => ({
      name: size,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: timePeriods.map((period) => {
        const sizeData = processedData[period][size];
        return sizeData ? sizeData.count : 0;
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
        const sizeCategory = param.seriesName;
        const count = param.value;

        result += `
          <div style="display:flex;align-items:center;margin:5px 0">
            <div style="width:10px;height:10px;background:${param.color};margin-right:5px"></div>
            ${size}: ${count} 
          </div>
        `;
      });

      return result;
    };

    const option = {
      title: {
        text: "Size Distribution",
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
        data: sizes,
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
      console.log("params ", params);
      if (onClick && params.seriesType === "bar") {
        onClick({
          sizeCategory: params.seriesName,
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

export default SizeDistributionChart;
