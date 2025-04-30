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
        acc[monthYear] = {
          totalCount: 0,
          totalValuation: 0,
          sizes: {},
        };
      }

      const sizeKey = item.SizeCategory || item.SizeGroup || "Unknown";
      const valuation =
        item.TotalPrice || (item.PricePerCarat || 0) * (item.Carats || 0);

      if (!acc[monthYear].sizes[sizeKey]) {
        acc[monthYear].sizes[sizeKey] = {
          // count: 0,
          valuation: 0,
          carats: 0,
        };
      }

      // acc[monthYear].sizes[sizeKey].count += item.StoneCount || 1;
      acc[monthYear].sizes[sizeKey].valuation += valuation;
      acc[monthYear].sizes[sizeKey].carats += item.Carats || 0;
      // acc[monthYear].totalCount += item.StoneCount || 1;
      acc[monthYear].totalValuation += valuation;

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

    // Prepare series data - now using valuation instead of count
    const seriesData = sizes.map((size) => ({
      name: size,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: timePeriods.map((period) => {
        const sizeData = processedData[period].sizes[size];
        return sizeData ? sizeData.valuation / 1000 : 0; // Convert to thousands
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
        const size = param.seriesName;
        const valuation = param.value * 1000; // Convert back from thousands
        const sizeData = periodData.sizes[size];

        if (sizeData) {
          const percentage = (
            (valuation / periodData.totalValuation) *
            100
          ).toFixed(1);
          // const count = sizeData.count;

          result += `
            <div style="display:flex;justify-content:space-between;margin:5px 0">
              <div style="display:flex;align-items:center;">
                <div style="width:10px;height:10px;background:${
                  param.color
                };margin-right:5px"></div>
                ${size}:
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
