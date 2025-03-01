import ApexCharts from "apexcharts";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BiDownload } from "react-icons/bi";
import commonService from "../../../Services/common.js";
import managerService from "../../../Services/managerService.js";

const Order = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [ordersInLast7Days, setOrdersInLast7Days] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [salesToday, setSalesToday] = useState(0);
  const [averageOrder, setAverageOrder] = useState(0);
  const [highestOrder, setHighestOrder] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrdersToday, setCompletedOrdersToday] = useState(0);
  const [top3Products, setTop3Products] = useState([]);

  useEffect(() => {
    managerService.getBranchOrders().then((response) => {
      if (response == "error") {
        console.log("error");
      } else {
        setOrders(response.data.orders);
        console.log(response.data);
      }
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    // setLoading(false);
    if (orders.length === 0) return;
    const last7Days = orders.filter((order) => {
      return (
        new Date(order.time) > new Date(new Date() - 7 * 24 * 60 * 60 * 1000) &&
        new Date(order.time) < new Date()
      );
    });
    setOrdersInLast7Days(last7Days.length);
    setNumberOfOrders(orders.length);
    setTotalSales(
      orders.reduce((acc, order) => {
        return acc + order.grand_total;
      }, 0)
    );
    setSalesToday(
      orders
        .filter((order) => {
          return (
            order.time.split("T")[0] === new Date().toISOString().split("T")[0]
          );
        })
        .reduce((acc, order) => {
          return acc + order.grand_total;
        }, 0)
    );
    setAverageOrder(
      orders.reduce((acc, order) => {
        return acc + order.grand_total;
      }, 0) / orders.length
    );
    setHighestOrder(
      Math.max(
        ...orders.map((order) => {
          return order.grand_total;
        })
      )
    );
    setActiveOrders(
      orders.filter((order) => {
        return order.status === "pending" || order.status === "ready";
      }).length
    );

    setCompletedOrdersToday(
      orders.filter((order) => {
        return (
          order.time.split("T")[0] === new Date().toISOString().split("T")[0] &&
          order.status === "completed"
        );
      }).length
    );
    setLoading(false);
  }, [orders]);

  const [ordersInLast7Days2, setOrdersInLast7Days2] = useState([]);
  const [last7Dates, setLast7Dates] = useState([]);

  useEffect(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(new Date() - i * 24 * 60 * 60 * 1000);
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1
      }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
    });
    setLast7Dates(dates.reverse());

    console.log(dates.reverse());
    console.log(last7Dates);
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;
    const last7Days = orders.filter((order) => {
      return (
        new Date(order.time) > new Date(new Date() - 7 * 24 * 60 * 60 * 1000) &&
        new Date(order.time) < new Date()
      );
    });
    //group by date
    const groupedOrders = last7Days.reduce((acc, order) => {
      const date = order.time.split("T")[0];
      acc[date] = acc[date] ? acc[date] + order.grand_total : order.grand_total;

      return acc;
    }, {});

    const ordersInLast7Days = last7Dates.map((date) => {
      console.log("date", date);
      return {
        date: date,
        total: groupedOrders[date] ? groupedOrders[date] : 0,
      };
    });

    console.log("order", ordersInLast7Days);

    setOrdersInLast7Days2(ordersInLast7Days);
  }, [orders]);

  const [ordersByType, setOrdersByType] = useState([
    { type: "", total: 0 },
    { type: "", total: 0 },
    { type: "", total: 0 },
  ]);

  useEffect(() => {
    if (orders.length === 0) return;
    const deliveryOrders = orders.filter((order) => {
      return order.order_type === "delivery";
    });

    const takeoutOrders = orders.filter((order) => {
      return order.order_type === "takeaway";
    });
    const dineInOrders = orders.filter((order) => {
      return order.order_type === "dine-in";
    });
    const ordersByType = [
      {
        type: "delivery",
        total: deliveryOrders.reduce((acc, order) => {
          return acc + order.grand_total;
        }, 0),
      },
      {
        type: "takeway",
        total: takeoutOrders.reduce((acc, order) => {
          return acc + order.grand_total;
        }, 0),
      },
      {
        type: "dine-in",
        total: dineInOrders.reduce((acc, order) => {
          return acc + order.grand_total;
        }, 0),
      },
    ];

    setOrdersByType(ordersByType);
  }, [orders]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const formatDateTime = (timeString) => {
    if (!timeString) return "";

    const date = new Date(timeString);

    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split("T")[0];

    // Get hours, minutes and seconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format with units
    const timeStr = `${hours} hrs ${minutes} min ${seconds} sec`;

    return `${dateStr} ${timeStr}`;
  };

  //chart data for order trends
  useEffect(() => {
    const options = {
      chart: {
        height: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 640, // Adjust for small screens
            options: {
              chart: {
                height: "100%", // Set a fixed height for small screens
              },
            },
          },
        ],
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

      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
          bottom: 2,
        },
      },
      series: [
        {
          name: "Sales",
          data: ordersInLast7Days2.map((order) => order.total),

          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: last7Dates.map((date) =>
          date.split("-").slice(1).join("-")
        ),
        labels: {
          style: {
            colors: "#828D99",
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#828D99",
            fontSize: "14px",
          },
        },
      },
    };

    const chart = new ApexCharts(
      document.getElementById("area-chart"),
      options
    );

    chart.render();

    // Clean up the chart instance on component unmount
    return () => {
      chart.destroy();
    };
  }, [ordersInLast7Days2, last7Dates]);

  //now create a pie chart for delivery vs pickup
  useEffect(() => {
    const options = {
      chart: {
        height: "100%",
        type: "donut",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: true,
        },
      },
      series: [
        ordersByType[0].total,
        ordersByType[1].total,
        ordersByType[2].total,
      ],
      labels: ["Delivery", "Takeaway", "Dine-in"],
      colors: ["#1A56DB", "#F87171", "#34D399"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "bottom",
        labels: {
          colors: "#000000",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                color: "#000000",
                fontSize: '14px',
              },
              value: {
                show: true,
                color: "#000000",
                fontSize: '12px',
                formatter: (val) => `${val}%`,
              },
              total: {
                show: true,
                label: 'Total',
                color: "#000000",
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return `${total}%`;
                },
              },
            },
          },
        },
      },
    };
  
    const chart = new ApexCharts(
      document.getElementById("donut-chart"),
      options
    );
  
    chart.render();
  
    // Clean up the chart instance on component unmount
    return () => {
      chart.destroy();
    };
  }, [ordersByType]);

  const [productQuantities, setProductQuantities] = useState([]);

  //get top 3 products
  useEffect(() => {
    const products = orders.reduce((acc, order) => {
      order.cart.forEach((item) => {
        acc[item.product_name] = acc[item.product_name]
          ? acc[item.product_name] + item.quantity
          : item.quantity;
      });
      return acc;
    }, {});

    const sortedProducts = Object.keys(products).sort(
      (a, b) => products[b] - products[a]
    );

    const top3 = sortedProducts.slice(0, 3);
    setTop3Products(top3);
    setProductQuantities(top3.map((product) => products[product]));
  }, [orders]);

  //show with a pie chart
  useEffect(() => {
    if (top3Products.length === 0 || productQuantities.length === 0) {
      return;
    }
    const options = {
      chart: {
        height: "100%",
        type: "pie",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: true,
        },
      },
      colors: ["#1A56DB", "#F87171", "#34D399", "#FBBF24", "#818CF8"],
      labels: top3Products,
      legend: {
        show: true,
        position: "bottom",
        labels: {
          colors: "#000000",
        },
      },
      series: productQuantities,
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(1) + "%";
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          colors: ['#fff']
        },
        dropShadow: {
          enabled: true
        },
        offset: 0, // This ensures labels are centered in each slice
        position: 'center' // This positions labels in the center of each slice
      },
      plotOptions: {
        pie: {
          customScale: 0.9, // Slightly reduce the size to give more room for labels
          offsetX: 0,
          offsetY: 0,
          dataLabels: {
            offset: -10, // Negative offset moves labels inward
            minAngleToShowLabel: 10 // Only show labels for slices with angle > 10 degrees
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
    const chart = new ApexCharts(document.getElementById("pie-chart"), options);
    chart.render();
    return () => {
      chart.destroy();
    };
  }, [orders, top3Products, productQuantities]);

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const onClickDownloadOrdersData = () => {
    const headers =
      "Order ID,Customer Name,Address,Total,Grand Total,Status,Payment Method,Order Type";
    const csv = orders.map((order) => {
      return `${commonService.handleCode(order._id)},${order.customer_name},${
        order.address
      },${order.total},${order.grand_total},${order.status},${
        order.payment_method
      },${order.order_type}`;
    });

    const csvData = [headers, ...csv].join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center fixed bg-white bg-opacity-50 top-0 left-0 w-full h-full z-50">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Total Orders</p>
            <p className="text-3xl text-black font-semibold">
              {numberOfOrders}
            </p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Orders in Last 7 Days</p>
            <p className="text-3xl text-black font-semibold">
              {ordersInLast7Days}
            </p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Total Sales</p>
            <p className="text-3xl text-black font-semibold">
              {totalSales.toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Sales Today</p>
            <p className="text-3xl text-black font-semibold">
              {salesToday.toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Average Order</p>
            <p className="text-3xl text-black font-semibold">
              {averageOrder.toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Highest Order</p>
            <p className="text-3xl text-black font-semibold">
              {highestOrder.toFixed(2)}
            </p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Active Orders</p>
            <p className="text-3xl text-black font-semibold">{activeOrders}</p>
          </div>
        </div>
        <div
          className="relative p-5 rounded-lg shadow-md h-24 card"
          style={{ background: "#ffffff" }}
        >
          <div>
            <p className="text-black text-md mb-0">Completed Orders Today</p>
            <p className="text-3xl text-black font-semibold">
              {completedOrdersToday}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between p-5 gap-5 w-full max-h-256">
        <div className="flex flex-col justify-between sm:items-center sm:flex-row sm:justify-between w-full h-196 lg:w-1/2 gap-5">
          <div id="donut-chart" className="w-full sm:w-1/2 sm:h-64"></div>
          <div id="pie-chart" className="w-full sm:w-1/2 sm:h-64"></div>{" "}
        </div>
        <div className="w-full lg:w-1/2 items-center justify-center">
          <div
            id="area-chart"
            className="h-64 items-center justify-center w-full"
          ></div>
        </div>
      </div>
      <div class="flex flex-col shadow-md rounded-lg p-5">
        <div className="w-full justify-end flex">
          <button
            onClick={onClickDownloadOrdersData}
            className=" text-black flex items-center focus:outline-none mb-2 mr-2"
          >
            <BiDownload className="mr-2" /> Download CSV
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" class="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Address
                </th>
                <th scope="col" class="px-6 py-3">
                  Total
                </th>
                <th scope="col" class="px-6 py-3">
                  Grand Total
                </th>
                <th scope="col" class="px-6 py-3">
                  Order Status
                </th>
                <th scope="col" class="px-6 py-3">
                  Payment Method
                </th>
                <th scope="col" class="px-6 py-3">
                  Order Type
                </th>
                <th scope="col" class="px-6 py-3">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {paginatedOrders.map((order) => (
                <tr
                  class="text-gray-700 dark:text-gray-400 cursor-pointer"
                  key={order._id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <p>{commonService.handleCode(order._id)}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.customer_name}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.address}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.total}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.grand_total.toFixed(2)}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.status}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.payment_method}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{order.order_type}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{formatDateTime(order.time)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
      {
        //overlay modal
        showModal && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          ></div>
        )
      }
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/2 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header closeButton className="border-b-2">
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2">
          <div className="flex items-center justify-between mb-2 mt-2">
            <p>
              <strong>Order ID:</strong>{" "}
              {selectedOrder ? commonService.handleCode(selectedOrder._id) : ""}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder?.customer_name}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2 mt-2">
            <p>
              <strong>Order Type:</strong> {selectedOrder?.order_type}
            </p>
            <p>
              <strong>Order Status:</strong> {selectedOrder?.status}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2 mt-2">
            <p>
              <strong>Payment Method:</strong> {selectedOrder?.payment_method}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder?.address}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2 mt-2">
            <p>
              <strong>Time:</strong>{" "}
              {selectedOrder ? formatDateTime(selectedOrder.time) : ""}
            </p>
            <p>
              <strong>Discount:</strong> {selectedOrder?.discount}%
            </p>
          </div>
          <div className="flex items-center justify-between mb-2 mt-2">
            <p>
              <strong>Total:</strong> PKR {selectedOrder?.total} /-
            </p>
            <p>
              <strong>Tax:</strong> {selectedOrder?.tax}%
            </p>
          </div>
          <p className="mt-2 mb-2">
            <strong>Grand Total:</strong> PKR {selectedOrder?.grand_total} /-
          </p>
          <p className="mt-2 mb-2">
            <strong>Cart:</strong>
          </p>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {selectedOrder?.cart.map((item) => (
                <tr
                  className="text-gray-700 dark:text-gray-400"
                  key={item.product_name}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <p>{item.product_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p>{item.quantity}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{item.price}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="border-t-2 p-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded w-full"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
