import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import ApexCharts from "apexcharts";
import { BiDownload } from "react-icons/bi";
import AdminService from "../../../Services/adminService.js";
import commonService from "../../../Services/common.js";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    AdminService.getAllOrders().then((response) => {
      if (response.error) {
        console.log(response.error);

        return;
      }
      setOrders(response.data);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersToday = orders.filter((order) => {
    return order.time.split("T")[0] === new Date().toISOString().split("T")[0];
  });

  const salesToday = ordersToday.reduce((acc, order) => {
    return acc + order.grand_total;
  }, 0);

  const last30Days = orders.filter((order) => {
    return (
      new Date(order.time) > new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
    );
  });

  const salesLast30Days = last30Days.reduce((acc, order) => {
    return acc + order.grand_total;
  }, 0);

  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (acc, order) => {
      return acc + order.grand_total;
    },

    0
  );

  const averageOrder = (totalSales / totalOrders).toFixed(2);

  const highestOrder = orders.reduce((acc, order) => {
    return Math.max(acc, order.grand_total);
  }, 0);

  const numberOfRefunds = orders.filter((order) => {
    return order.status === "cancelled";
  }).length;

  const totalTax = orders.reduce((acc, order) => {
    return acc + order.tax;
  }, 0);

  //calculations for order trends
  const ordersByDay = orders.reduce((acc, order) => {
    const day = new Date(order.time).getDay();
    acc[day] = acc[day] ? acc[day] + 1 : 1;
    return acc;
  }, {});

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
          name: "Orders",
          data: Object.values(ordersByDay),
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
        labels: {
          style: {
            colors: "#828D99",
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        min: 0,
        max: Math.max(...Object.values(ordersByDay)),
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
  }, [ordersByDay]);

  //create data for delivery vs pickup chart
  const deliveryVsPickup = orders.reduce(
    (acc, order) => {
      if (order.order_type === "delivery") {
        acc.delivery += 1;
      } else if (order.order_type === "takeaway") {
        acc.takeway += 1;
      } else if (order.order_type === "dine-in") {
        acc.dine += 1;
      }
      return acc;
    },
    { delivery: 0, takeway: 0, dine: 0 }
  );

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
      dataLabels: {
        enabled: false,
      },
      series: [
        deliveryVsPickup.delivery,
        deliveryVsPickup.takeway,
        deliveryVsPickup.dine,
      ],
      labels: ["Delivery", "Takeaway", "Dine-in"],
      colors: ["#1A56DB", "#F87171", "#34D399"],
      //change label colors

      legend: {
        show: true,
        //change legend colors
        labels: {
          colors: "#000000",
        },
        //change where the legend is placed to bottom
        position: "bottom",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                color: "#000000", // Change this to your desired color
              },
              value: {
                show: true,
                color: "#000000", // Change this to your desired color
              },
              total: {
                show: true,
                color: "#000000", // Change this to your desired color
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
  }, [deliveryVsPickup]);

  useEffect(() => {
    //get orders for last 7 days only than 2021-09-01T12:00:00Z
    const last7Days = orders.filter((order) => {
      return (
        new Date(order.time) > new Date(new Date() - 7 * 24 * 60 * 60 * 1000) &&
        new Date(order.time) < new Date()
      );
    });

    // Prepare the data
    const categories = Array.from(
      new Set(last7Days.map((order) => order.time.split("T")[0]))
    );
    const seriesData = {
      Cash: new Array(categories.length).fill(0),
      Card: new Array(categories.length).fill(0),
    };

    console.log("Categories", categories);

    last7Days.forEach((order) => {
      const date = order.time.split("T")[0];
      const index = categories.indexOf(date);

      if (order.payment_method === "cash") {
        seriesData.Cash[index] += order.grand_total;
      } else if (order.payment_method === "card") {
        seriesData.Card[index] += order.grand_total;
      }
    });

    console.log("Series Data", seriesData);

    const options = {
      chart: {
        height: "100%",
        type: "bar",
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      colors: ["#1A56DB", "#F87171", "#34D399"],
      series: [
        {
          name: "cash",
          data: seriesData.Cash,
        },
        {
          name: "card",
          data: seriesData.Card,
        },
      ],
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: "#828D99",
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          style: {
            colors: "#828D99",
            fontSize: "14px",
          },
        },
      },
      legend: {
        show: true,
        labels: {
          colors: "#000000",
        },
      },
    };

    const chart = new ApexCharts(document.getElementById("bar-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [orders]);

  const [top3Products, setTop3Products] = useState([]);
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
      {/* Stats Grid - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">Total Orders</p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {totalOrders}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">Total Sales</p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {totalSales.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">Sales Today</p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {salesToday.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">
              Sales Last 30 Days
            </p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {salesLast30Days.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">Average Order</p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {averageOrder}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">Highest Order</p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {highestOrder.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">
              Number of Refunds
            </p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {numberOfRefunds}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col">
            <p className="text-black text-sm lg:text-md mb-1">
              Total Tax Collected
            </p>
            <p className="text-xl lg:text-3xl text-black font-semibold">
              {totalTax.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 h-[64rem]">
        <div >
          <div id="area-chart" className="w-full h-64 "></div>
        </div>
        <div>
          <div id="donut-chart" className="w-full h-64 "></div>
        </div>
        <div>
          <div id="bar-chart" className="w-full h-64 "></div>
        </div>
        <div>
          <div id="pie-chart" className="w-full h-64 "></div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative overflow-x-auto shadow-md rounded-lg p-4">
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={onClickDownloadOrdersData}
            className="text-black flex items-center focus:outline-none"
          >
            <BiDownload className="mr-2" /> Download CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-4 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">
                  Address
                </th>
                <th scope="col" className="px-4 py-3">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                  Grand Total
                </th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                  Payment
                </th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.order_id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    {commonService.handleCode(order._id)}
                  </td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {order.address}
                  </td>
                  <td className="px-4 py-3">{order.total}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {order.grand_total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {order.status}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {order.payment_method}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {order.order_type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-row sm:flex-row justify-between items-center mt-4 gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="w-1/4 sm:w-auto px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-1/4 sm:w-auto px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          onClick={() => setShowModal(false)}
        />
      )}

      {/* Order Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-4/5 lg:w-2/3 max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl z-50 p-4"
      >
        <Modal.Header closeButton className="border-b pb-4">
          <Modal.Title className="text-lg font-semibold">
            Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <p>
              <strong>Order ID:</strong>{" "}
              {selectedOrder ? commonService.handleCode(selectedOrder._id) : ""}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder?.customer_name}
            </p>
            <p>
              <strong>Order Type:</strong> {selectedOrder?.order_type}
            </p>
            <p>
              <strong>Order Status:</strong> {selectedOrder?.status}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder?.payment_method}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder?.address}
            </p>
            <p>
              <strong>Time:</strong> {selectedOrder?.time}
            </p>
            <p>
              <strong>Discount:</strong> {selectedOrder?.discount}%
            </p>
            <p>
              <strong>Total:</strong> PKR {selectedOrder?.total} /-
            </p>
            <p>
              <strong>Tax:</strong> {selectedOrder?.tax}%
            </p>
            <p className="sm:col-span-2">
              <strong>Grand Total:</strong> PKR {selectedOrder?.grand_total} /-
            </p>
          </div>

          <p className="font-semibold mb-2">Cart Items:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedOrder?.cart.map((item) => (
                  <tr key={item.product_name}>
                    <td className="px-4 py-2">{item.product_name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t pt-4">
          <button
            onClick={() => setShowModal(false)}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
