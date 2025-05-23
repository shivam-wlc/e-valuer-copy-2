import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const QualityModelChart = ({
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
      const date = new Date(item.AuctionDate?.split("/").reverse().join("-"));
      if (isNaN(date.getTime())) return acc; // Skip if date is invalid

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

    // Check if we have meaningful comparison data
    const hasComparisonData = timePeriods.length > 1;

    // If we don't have meaningful comparison data, show a pie chart
    if (!hasComparisonData) {
      // Process data for pie chart by quality
      const qualityTotals = data.reduce((acc, item) => {
        const qualityKey = `${item.Quality}` || "Unknown";
        if (!acc[qualityKey]) {
          acc[qualityKey] = 0;
        }

        const valuation =
          item.TotalPrice || (item.PricePerCarat || 0) * (item.Carats || 0);

        acc[qualityKey] += valuation;
        return acc;
      }, {});

      const pieData = Object.entries(qualityTotals).map(([quality, value]) => ({
        name: `Quality ${quality}`,
        value: Math.round(value),
      }));

      const pieChartOption = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: ${c} ({d}%)",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        title: {
          text: "Quality Distribution",
          // subtext: "Total value by quality",
          top: 0,
          left: "center",
        },
        series: [
          {
            name: "Quality Value",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: pieData,
          },
        ],
      };

      chart.setOption(pieChartOption);

      // Handle click event for pie chart
      chart.off("click");
      chart.on("click", (params) => {
        if (onClick) {
          const qualityMatch = params.name.match(/Quality (\d+)/);
          if (qualityMatch) {
            onClick({
              type: "quality",
              quality: parseInt(qualityMatch[1], 10),
              value: params.value,
            });
          }
        }
      });

      // Handle resize
      const handleResize = () => chart.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.off("click");
        chart.dispose();
      };
    }

    // If we have comparison data, continue with the original line chart
    // Calculate total valuation for each time period
    const totalValuations = timePeriods.map(
      (period) => processedData[period].totalValuation / 1000
    );

    // Create a series for each quality level
    const seriesData = qualities.map((quality) => {
      // Data for the area chart
      const areaData = timePeriods.map((period) => {
        const qualityData = processedData[period].qualities[quality];
        return qualityData ? qualityData.valuation / 1000 : 0; // Convert to thousands
      });

      // Calculate percentage data for each period
      const percentageData = timePeriods.map((period, index) => {
        const qualityData = processedData[period].qualities[quality];
        const value = qualityData ? qualityData.valuation : 0;
        const total = processedData[period].totalValuation;
        return total > 0 ? (value / total) * 100 : 0;
      });

      return [
        {
          name: `Quality ${quality} (Value)`,
          type: "line",
          stack: "value",
          areaStyle: {
            opacity: 0.5,
          },
          emphasis: {
            focus: "series",
            scale: true,
            areaStyle: {
              opacity: 0.8,
            },
          },
          data: areaData,
          z: 10,
          // These are crucial for click events to work
          symbol: "circle",
          symbolSize: 8,
          triggerLineEvent: true, // Enable line click events
          triggerEvent: true, // Enable click events for this series
        },
        {
          name: `Quality ${quality} (%)`,
          type: "line",
          yAxisIndex: 1,
          symbol: "circle",
          symbolSize: 8,
          showSymbol: true,
          lineStyle: {
            width: 2,
            type: "dotted",
          },
          data: percentageData,
          z: 20,
          triggerEvent: true, // Enable click events for this series
        },
      ];
    });

    // Flatten series data
    const flattenedSeries = seriesData.flat();

    // Add total valuation line
    flattenedSeries.push({
      name: "Total Valuation",
      type: "line",
      data: totalValuations,
      symbol: "diamond",
      symbolSize: 10,
      lineStyle: {
        width: 4,
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowBlur: 10,
        shadowOffsetY: 5,
      },
      itemStyle: {
        color: "#ff9900",
      },
      emphasis: {
        lineStyle: {
          width: 6,
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: "#fff",
          shadowBlur: 15,
        },
      },
      z: 30,
      triggerEvent: true, // Enable click events for this series
    });

    // Create tooltip formatter
    const tooltipFormatter = (params) => {
      const timePeriod = params[0].axisValue;
      const periodData = processedData[timePeriod];
      let result = `<div style="font-weight:bold;margin-bottom:5px">${timePeriod}</div>`;
      result += `<div>Total Valuation: ${(
        periodData.totalValuation / 1000
      ).toFixed(1)}K</div>`;
      result += `<hr style="margin:5px 0;border-color:#eee"/>`;

      // Group by quality for better display
      const qualityGroups = {};

      params.forEach((param) => {
        const seriesName = param.seriesName;
        if (seriesName === "Total Valuation") return;

        const match = seriesName.match(/Quality (\d+)/);
        if (match) {
          const quality = match[1];
          if (!qualityGroups[quality]) {
            qualityGroups[quality] = {
              color: param.color,
              value: null,
              percentage: null,
            };
          }

          if (seriesName.includes("(Value)")) {
            qualityGroups[quality].value = param.value;
          } else if (seriesName.includes("(%)")) {
            qualityGroups[quality].percentage = param.value;
          }
        }
      });

      // Add total valuation separately at the top
      const totalValParam = params.find(
        (p) => p.seriesName === "Total Valuation"
      );
      if (totalValParam) {
        result += `
          <div style="display:flex;justify-content:space-between;margin:5px 0">
            <div style="display:flex;align-items:center;">
              <div style="width:10px;height:10px;background:${
                totalValParam.color
              };margin-right:5px"></div>
              Total Valuation:
            </div>
            <div style="text-align:right">
              ${totalValParam.value.toFixed(1)}K
            </div>
          </div>
          <hr style="margin:5px 0;border-color:#eee"/>
        `;
      }

      // Display quality groups
      Object.entries(qualityGroups).forEach(([quality, data]) => {
        const pct = ((data.value * 1000) / periodData.totalValuation) * 100;

        result += `
          <div style="display:flex;justify-content:space-between;margin:5px 0">
            <div style="display:flex;align-items:center;">
              <div style="width:10px;height:10px;background:${
                data.color
              };margin-right:5px"></div>
              Quality ${quality}:
            </div>
            <div style="text-align:right">
              ${data.value ? data.value.toFixed(1) + "K" : "N/A"}
            
              ${pct ? " (" + pct.toFixed(1) + "%)" : ""}
            </div>
          </div>
        `;
      });

      return result;
    };

    // Set color palette
    const colorPalette = [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
      "#36c5b8",
      "#4381de",
      "#7be372",
      "#f9d656",
      "#f05b5b",
      "#61b6de",
    ];

    // Set chart options
    const option = {
      title: {
        text: "Quality Distribution",
        subtext: "",
        top: 0,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: tooltipFormatter,
        axisPointer: {
          type: "cross",
          animation: true,
          label: {
            backgroundColor: "#505765",
          },
        },
      },
      legend: {
        type: "scroll",
        top: 60,
        data: [
          ...qualities.map((q) => `Quality ${q} (Value)`),
          ...qualities.map((q) => `Quality ${q} (%)`),
          "Total Valuation",
        ],
        selected: {
          ...qualities.reduce((acc, q) => {
            acc[`Quality ${q} (%)`] = false;
            return acc;
          }, {}),
        },
      },
      grid: {
        top: 120,
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      dataZoom: [
        {
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: "category",
        data: timePeriods,
        name: "Time Period",
        nameLocation: "middle",
        nameGap: 35,
        boundaryGap: false,
        axisLabel: {
          rotate: timePeriods.length > 4 ? 45 : 0,
          interval: 0,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Valuation ($K)",
          position: "left",
          axisLabel: {
            formatter: "{value}K",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        {
          type: "value",
          name: "Percentage (%)",
          position: "right",
          axisLabel: {
            formatter: "{value}%",
          },
          splitLine: {
            show: false,
          },
          max: 100,
          min: 0,
        },
      ],
      series: flattenedSeries,
      color: colorPalette,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      textStyle: {
        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
    };

    chart.setOption(option);

    // Handle click event - improved version
    const handleClick = (params) => {
      console.log("Chart click params:", params);

      if (!onClick) return;

      // Handle different click scenarios
      if (params.seriesType === "line") {
        if (params.seriesName === "Total Valuation") {
          onClick({
            type: "total",
            timePeriod: params.name,
            value: params.value,
          });
        } else if (params.seriesName.includes("(Value)")) {
          const qualityMatch = params.seriesName.match(/Quality (\d+)/);
          if (qualityMatch) {
            onClick({
              type: "qualityValue",
              quality: parseInt(qualityMatch[1], 10),
              timePeriod: params.name,
              value: params.value,
            });
          }
        } else if (params.seriesName.includes("(%)")) {
          const qualityMatch = params.seriesName.match(/Quality (\d+)/);
          if (qualityMatch) {
            onClick({
              type: "qualityPercentage",
              quality: parseInt(qualityMatch[1], 10),
              timePeriod: params.name,
              percentage: params.value,
            });
          }
        }
      }
    };

    // Set up event listeners
    chart.off("click"); // Remove previous listeners
    chart.on("click", handleClick);

    // Handle resize
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.off("click"); // Clean up
      chart.dispose();
    };
  }, [data, onClick]);

  return (
    <div
      ref={chartRef}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        // Ensure the container is properly set up for events
        position: "relative",
        zIndex: 0,
      }}
    />
  );
};

export default QualityModelChart;
