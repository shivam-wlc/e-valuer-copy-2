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
        acc[monthYear] = {
          totalValuation: 0,
          models: {},
        };
      }

      const valuation =
        item.TotalPrice || (item.PricePerCarat || 0) * (item.Carats || 0);

      if (!acc[monthYear].models[item.Model]) {
        acc[monthYear].models[item.Model] = {
          valuation: 0,
          carats: 0,
        };
      }

      acc[monthYear].models[item.Model].valuation += valuation;
      acc[monthYear].models[item.Model].carats += item.Carats || 0;
      acc[monthYear].totalValuation += valuation;

      return acc;
    }, {});

    // Get sorted time periods and models
    const timePeriods = Object.keys(processedData).sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const models = [...new Set(data.map((item) => item.Model))].sort();

    // Prepare series data - using valuation instead of count
    const seriesData = models.map((model) => ({
      name: model,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: timePeriods.map((period) => {
        const modelData = processedData[period].models[model];
        return modelData ? modelData.valuation / 1000 : 0;
      }),

      label: {
        show: true,
        position: "inside",
        formatter: (params) => {
          const timePeriod = params.name;

          const periodData = processedData[timePeriod];

          if (periodData?.models) {
            let data = periodData?.models;

            const filteredData = Object.entries(data).filter(
              ([key, value]) => value.valuation >= 10
            );

            if (filteredData.length < 8) {
              const value = params.value * 1000;
              const total = periodData?.totalValuation || 1;
              const percent = (value / total) * 100;

              if (value === 0) {
                return "";
              }

              return `${percent.toFixed(1)}%`;
            } else {
              return "";
            }
          } else {
            return "";
          }
        },
        fontSize: 10,
        color: "#fff",
      },
    }));

    // Prepare tooltip formatter to show valuation and percentage
    const tooltipFormatter = (params) => {
      const timePeriod = params[0].axisValue;
      const periodData = processedData[timePeriod];
      let result = `<div style="font-weight:bold;margin-bottom:5px">${timePeriod}</div>`;
      // result += `<div>Total Valuation: ${periodData.totalValuation.toLocaleString(
      //   "en-US",
      //   {
      //     style: "currency",
      //     currency: "USD",
      //     minimumFractionDigits: 0,
      //     maximumFractionDigits: 0,
      //   }
      // )}</div>`;
      result += `<div>Total Valuation: ${(
        periodData.totalValuation / 1000
      ).toFixed(1)}K</div>`;
      result += `<hr style="margin:5px 0;border-color:#eee"/>`;

      params.forEach((param) => {
        const model = param.seriesName;
        const valuation = param.value * 1000;
        const modelData = periodData.models[model];

        if (modelData) {
          const percentage = (
            (valuation / periodData.totalValuation) *
            100
          ).toFixed(1);
          const carats = modelData.carats;

          result += `
            <div style="display:flex;justify-content:space-between;margin:5px 0">
              <div style="display:flex;align-items:center;">
                <div style="width:10px;height:10px;background:${
                  param.color
                };margin-right:5px"></div>
                ${model}:
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

    console.log(timePeriods.length,"time period")
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
          rotate: timePeriods.length > 4 ? 45 : 0,
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Valuation ($K)",
        axisLabel: {
          // formatter: (value) => {
          //   if (value >= 1000000) {
          //     return `$${(value / 1000000).toFixed(0)}M`;
          //   } else if (value >= 1000) {
          //     return `$${(value / 1000).toFixed(0)}K`;
          //   }
          //   return `$${value}`;
          // },
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
