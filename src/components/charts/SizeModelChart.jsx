// import React, { useEffect, useRef } from "react";
// import * as echarts from "echarts";
// const SizeModelChart = ({
//   data,
//   dimensions = { width: "100%", height: "400px" },
//   onClick,
// }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     const chart = echarts.init(chartRef.current);

//     const sizeCategories = [...new Set(data.map((item) => item.SizeCategory))];
//     const models = [...new Set(data.map((item) => item.Model))];

//     const seriesData = models.map((model) => ({
//       name: model,
//       type: "bar",
//       stack: "total",
//       data: sizeCategories.map(
//         (size) =>
//           data.filter(
//             (item) => item.SizeCategory === size && item.Model === model
//           ).length
//       ),
//     }));

//     const option = {
//       title: { text: "Model Distribution by Size Category", top: 0 },
//       tooltip: { trigger: "item", axisPointer: { type: "shadow" } },
//       legend: { data: models, type: "scroll", top: 30 },
//       grid: {
//         top: 100,
//         left: "3%",
//         right: "4%",
//         bottom: "3%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         data: sizeCategories,
//         name: "Size Category",
//         nameLocation: "middle",
//         nameGap: 22,
//       },
//       yAxis: { type: "value", name: "Count" },

//       series: seriesData,
//     };

//     chart.setOption(option);

//     chart.on("click", (params) => {
//       if (onClick) {
//         onClick({ model: params.seriesName }); // or appropriate key/value
//       }
//     });

//     return () => chart.dispose();
//   }, [data]);

//   return (
//     <div
//       ref={chartRef}
//       style={{ width: dimensions.width, height: dimensions.height }}
//     />
//   );
// };
// export default SizeModelChart;
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const ModelDistributionChart = ({
  data,
  dimensions = { width: "100%", height: "500px" },
  onClick,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Process data - group by month/year and model
    const processedData = data.reduce((acc, item) => {
      const date = new Date(item.AuctionDate.split("/").reverse().join("-"));
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }

      if (!acc[monthYear][item.Model]) {
        acc[monthYear][item.Model] = {
          count: 0,
          totalPricePerCarat: 0,
          items: 0,
        };
      }

      acc[monthYear][item.Model].count += item.StoneCount || 1;
      acc[monthYear][item.Model].totalPricePerCarat += item.PricePerCarat || 0;
      acc[monthYear][item.Model].items += 1;

      return acc;
    }, {});

    // Get sorted time periods and models
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const models = [...new Set(data.map((item) => item.Model))].sort();

    // Prepare series data
    const seriesData = models.map((model) => ({
      name: model,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: timePeriods.map((period) => {
        const modelData = processedData[period][model];
        return modelData ? modelData.count : 0;
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
        const model = param.seriesName;
        const count = param.value;

        result += `
          <div style="display:flex;align-items:center;margin:5px 0">
            <div style="width:10px;height:10px;background:${param.color};margin-right:5px"></div>
            ${model}: ${count} 
          </div>
        `;
      });

      return result;
    };

    const option = {
      title: {
        text: "Model Distribution",
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
        data: models,
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
          model: params.seriesName,
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

export default ModelDistributionChart;
