import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import AdminService from "../../../Services/adminService";

const Donut = () => {
  const [salesData, setSalesData] = useState({});
  const [branchNames, setBranchNames] = useState([]);
  const [branchSales, setBranchSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getBranchSales();
      if (response.error) {
        console.log(response.error);
      } else {
        setSalesData(response.data);
        console.log("sales data", response.data);
        //map branch names and sales
        const names = [];
        const sales = [];
        response.data.forEach((branch) => {
          names.push(branch.branch);
          sales.push(branch.sales);
        });
        setBranchNames(names);
        setBranchSales(sales);

        console.log("branch names", names);
      }
    };
    fetchData();
  }, []);

  const convertToK = (value) => {
    return value / 1000;
  };

  useEffect(() => {
    const chartOptions = {
      series: branchSales,
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        width: "100%",
        type: "donut",
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              color: "#000000",
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },

              total: {
                showAlways: true,
                show: true,
                label: "Total",
                fontFamily: "Inter, sans-serif",
                color: "#ffffff",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                  return convertToK(sum) + "k";
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                color: "#ffffff",
                offsetY: -20,
                formatter: function (value) {
                  return convertToK(value) + "k";
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: branchNames,
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        labels: {
          colors: "#ffffff",
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value;
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value;
          },
          colors: "#000000",
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#donut-chart"),
      chartOptions
    );
    chart.render();

    // Clean up the chart instance on component unmount
    return () => {
      chart.destroy();
    };
  }, [branchSales, branchNames]);

  const onClickDownloadAsCsv = () => {
    const csv = branchNames.map((branch, index) => {
      return `${branch},${branchSales[index]}\n`;
    });
    const hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "sales.csv";
    hiddenElement.click();
  };

  return (
    <div class="w-1/4 bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 h-96">
      <div class="flex justify-between mb-10">
        <div class="flex justify-center items-center ">
          <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1 ">
            Sales distribution
          </h5>
          <svg
            data-popover-target="chart-info"
            data-popover-placement="bottom"
            class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
          </svg>
          <div
            data-popover
            id="chart-info"
            role="tooltip"
            class="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
          >
            <div class="p-3 space-y-2">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Activity growth - Incremental
              </h3>
              <p>
                Report helps navigate cumulative growth of community activities.
                Ideally, the chart should have a growing trend, as stagnating
                chart signifies a significant decrease of community activity.
              </p>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Calculation
              </h3>
              <p>
                For each date bucket, the all-time volume of activities is
                calculated. This means that activities in period n contain all
                activities up to period n, plus the activities generated by your
                community in period.
              </p>
              <a
                href="#"
                class="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline"
              >
                Read more{" "}
                <svg
                  class="w-2 h-2 ms-1.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </div>
            <div data-popper-arrow></div>
          </div>
        </div>
        <div>
          <button
            type="button"
            data-tooltip-target="data-tooltip"
            data-tooltip-placement="bottom"
            class="hidden sm:inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm"
          >
            <svg
              class="w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 18"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
              />
            </svg>
            <span class="sr-only">Download data</span>
          </button>
          <div
            onClick={onClickDownloadAsCsv}
            id="data-tooltip"
            role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Download CSV
          </div>
        </div>
      </div>

      <div  id="donut-chart" className="h-96"></div>
    </div>
  );
};

export default Donut;
