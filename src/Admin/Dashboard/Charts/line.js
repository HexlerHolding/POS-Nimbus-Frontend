import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import AdminService from "../../../Services/adminService";
import { BsArrowUp } from "react-icons/bs";
import { BsArrowDown } from "react-icons/bs";

const Line = ({}) => {
  const [orders, setOrders] = useState([]);

  const [totalSalesinLast7Days, setTotalSalesinLast7Days] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getAllOrders();
      if (response && response.data) {
        setOrders(response.data);
        console.log("ok", response.data);
      }
    };
    fetchData();
  }, []);

  const [last7DaysOrders, setLast7DaysOrders] = useState([]);
  useEffect(() => {
    let orders2 = [];
    let sales = 0;
    orders.map((order) => {
      if (
        new Date(order.time).getTime() >
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      ) {
        sales += order.total;
        orders2.push(order);
      }
    });
    setLast7DaysOrders(orders2);
    console.log(orders2);
    setTotalSalesinLast7Days(sales);
  }, [orders]);

  const [last7Dates, setLast7Dates] = useState([]);

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toDateString().slice(4, 10));
    }
    //sort dates in ascending order
    dates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    setLast7Dates(dates);
  }, []);

  const [last7Days, setLast7Days] = useState([]);

  useEffect(() => {
    var sales = [0, 0, 0, 0, 0, 0, 0];
    last7DaysOrders.map((order) => {
      const index =
        6 -
        Math.floor(
          (new Date().getTime() - new Date(order.time).getTime()) /
            (24 * 60 * 60 * 1000)
        );
      console.log("index", index);

      sales[index] += order.total;
    });
    console.log(sales);
    setLast7Days(sales);
  }, [last7DaysOrders]);

  useEffect(() => {
    const options = {
      chart: {
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },
      series: [
        {
          name: "Sales",
          data: last7Days,
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: last7Dates,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#area-chart"),
      options
    );
    chart.render();

    // Clean up the chart instance on component unmount
    return () => {
      chart.destroy();
    };
  }, [last7Days]);

  const convertNumbertoK = (number) => {
    if (number > 999) {
      return (number / 1000).toFixed(1) + "k";
    }
    return number;
  };

  const [percentageChangeFromLastDay, setPercentageChangeFromLastDay] =
    useState(0);

  useEffect(() => {
    const totalYesterday = last7Days[last7Days.length - 2];
    const totalToday = last7Days[last7Days.length - 1];

    const percentageChange =
      ((totalToday - totalYesterday) / totalYesterday) * 100;
    setPercentageChangeFromLastDay(percentageChange.toFixed(1));
  }, [last7Days]);

  return (
    <div className="w-1/4 bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 h-96">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            {convertNumbertoK(totalSalesinLast7Days)}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Total Sales
          </p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-center">
          {percentageChangeFromLastDay > 0 ? (
            <div className="flex items-center text-green-500 dark:text-green-500">
              {percentageChangeFromLastDay} %{" "}
              <BsArrowUp className="text-green-500 dark:text-green-500" />
            </div>
          ) : (
            <div className="flex items-center text-red-500 dark:text-red-500">
              {percentageChangeFromLastDay} %{" "}
              <BsArrowDown className="text-red-500 dark:text-red-500" />
            </div>
          )}
        </div>
      </div>
      <div id="area-chart" className="h-96"></div>
    </div>
  );
};

export default Line;
