import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import AdminService from "../../../Services/adminService";

const Chart = () => {
  const [orders, setOrders] = useState([]);
  const [completedOrdersPercentage, setCompletedOrdersPercentage] = useState(0);
  const [inProgressOrdersPercentage, setInProgressOrdersPercentage] =
    useState(0);
  const [readyOrdersPercentage, setReadyOrdersPercentage] = useState(0);

  const [numberOfCompletedOrders, setNumberOfCompletedOrders] = useState(0);
  const [numberOfInProgressOrders, setNumberOfInProgressOrders] = useState(0);
  const [numberOfReadyOrders, setNumberOfReadyOrders] = useState(0);

  const setData = () => {
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const inProgressOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const readyOrders = orders.filter(
      (order) => order.status === "ready"
    ).length;

    setNumberOfCompletedOrders(completedOrders);
    setNumberOfInProgressOrders(inProgressOrders);
    setNumberOfReadyOrders(readyOrders);

    setCompletedOrdersPercentage(
      Math.round((completedOrders / orders.length) * 100)
    );
    setInProgressOrdersPercentage(
      Math.round((inProgressOrders / orders.length) * 100)
    );
    setReadyOrdersPercentage(Math.round((readyOrders / orders.length) * 100));
  };

  useEffect(() => {
    setData();
  }, [orders]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getAllOrders();
      if (response && response.data) {
        setOrders(response.data);
        console.log("orders made", response.data);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const chartOptions = {
  //     series: [
  //       completedOrdersPercentage,
  //       inProgressOrdersPercentage,
  //       readyOrdersPercentage,
  //     ],
  //     colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
  //     chart: {
  //       height: 310,
  //       width: "100%",
  //       type: "radialBar",
  //     },
  //     plotOptions: {
  //       radialBar: {
  //         track: {
  //           background: "#E5E7EB",
  //         },
  //         dataLabels: {
  //           show: false,
  //         },
  //         hollow: {
  //           margin: 0,
  //           size: "32%",
  //         },
  //       },
  //     },
  //     grid: {
  //       show: false,
  //       strokeDashArray: 4,
  //       padding: {
  //         left: 2,
  //         right: 2,
  //         top: -23,
  //         bottom: -20,
  //       },
  //     },
  //     labels: ["Completed", "In progress", "Ready"],
  //     legend: {
  //       show: false,
  //       position: "bottom",
  //       fontFamily: "Inter, sans-serif",
  //     },
  //     tooltip: {
  //       enabled: true,
  //       x: {
  //         show: false,
  //       },
  //     },
  //     yaxis: {
  //       show: false,
  //       labels: {
  //         formatter: function (value) {
  //           return value + "%";
  //         },
  //       },
  //     },
  //   };

  //   const chart = new ApexCharts(
  //     document.querySelector("#radial-chart"),
  //     chartOptions
  //   );
  //   chart.render();

  //   return () => {
  //     chart.destroy();
  //   };
  // }, [
  //   completedOrdersPercentage,
  //   inProgressOrdersPercentage,
  //   readyOrdersPercentage,
  //   orders,
  // ]);

  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const handleShowMoreDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

  const [branches, setBranches] = useState([]);
  const [branchesOpen, setBranchesOpen] = useState(false);
  const [branchesClosed, setBranchesClosed] = useState(false);
  const [totalNumberOfBranches, setTotalNumberOfBranches] = useState(0);

  const getData = () => {
    let open = 0;
    let closed = 0;
    branches.map((branch) => {
      if (branch.shift_status === true) {
        open += 1;
      } else {
        closed += 1;
      }
    });
    setBranchesOpen(open);
    setBranchesClosed(closed);
    setTotalNumberOfBranches(branches.length);
  };

  useEffect(() => {
    getData();
  }, [branches]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getBranches();
      if (response.error) {
        console.log(response.error);
      } else {
        setBranches(response.data);
        console.log("branches", response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6 h-96 flex flex-col">
      <div className="flex justify-start items-start">
        <h5 className="text-xl font-bold leading-none text-gray-100 pe-1 mb-5">
          Order progress
        </h5>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-5">
        <div className="grid grid-cols-3 gap-3 mb-2">
          <dl className="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">
              {numberOfReadyOrders}
            </dt>
            <dd className="text-orange-600 dark:text-orange-300 text-sm font-medium">
              Ready
            </dd>
          </dl>
          <dl className="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">
              {numberOfInProgressOrders}
            </dt>
            <dd className="text-teal-600 dark:text-teal-300 text-sm font-medium">
              In progress
            </dd>
          </dl>
          <dl className="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">
              {numberOfCompletedOrders}
            </dt>
            <dd className="text-blue-600 dark:text-blue-300 text-sm font-medium">
              Done
            </dd>
          </dl>
        </div>
      </div>
      <div className="flex justify-start items-start">
        <h5 className="text-xl font-bold leading-none text-gray-100 pe-1 mb-5">
          Branches status
        </h5>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
        <div className="grid grid-cols-3 gap-3 mb-2">
          <dl className="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">
              {branchesOpen}
            </dt>
            <dd className="text-teal-600 dark:text-teal-300 text-sm font-medium">
              Open
            </dd>
          </dl>
          <dl className="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-red-600 dark:text-red-400 text-sm font-medium flex items-center justify-center mb-1">
              {branchesClosed}
            </dt>
            <dd className="text-red-600 dark:text-red-400 text-sm font-medium">
              Closed
            </dd>
          </dl>
          <dl className="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">
              {totalNumberOfBranches}
            </dt>
            <dd className="text-blue-600 dark:text-blue-300 text-sm font-medium">
              Total
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Chart;
