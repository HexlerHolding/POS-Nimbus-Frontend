import React, { useState, useEffect } from "react";
import Logo from "../../Assets/Logo.png";
import Line from "./Charts/line";
import ExpenseChart from "./Charts/expenseChart";
import Donut from "./Charts/donut";
import Chart from "./Charts/chart";
import AdminService from "../../Services/adminService";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [numberOfBranches, setNumberOfBranches] = useState(0);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [orders7Days, setOrders7Days] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getAllOrders();
      if (response && response.data) {
        setOrders(response.data);
        console.log(orders);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getAllProducts();
      if (response && response.data) {
        setProducts(response.data);
        console.log(response.data);
        setNumberOfProducts(response.data.length);
      }
    };
    fetchData();
  }, []);

  const [numberOfOrdersInLast24Hours, setnumberOfOrdersInLast24Hours] =
    useState(0);
  const [salesInLast24Hours, setSalesInLast24Hours] = useState(0);

  useEffect(() => {
    let count = 0;
    let sales = 0;
    let orders2 = [];
    console.log("date", new Date().toString());
    orders.map((order) => {
      if (
        new Date(order.time).getTime() >
        new Date().getTime() - 1 * 24 * 60 * 60 * 1000
      ) {
        count++;
        sales += order.total;
        orders2.push(order);
      }
    });
    setnumberOfOrdersInLast24Hours(count);
    setSalesInLast24Hours(sales);
    setOrders7Days(orders2);
  }, [orders]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminService.getNumberOfBranches();
      if (response && response.data) {
        setNumberOfBranches(response.data.numberOfBranches);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5 gap-5">
          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between"
            style={{ background: "#2c302c" }}
          >
            <div>
              <p className="text-white text-lg mb-3">
                Total Orders in Last 24 Hours
              </p>
              <p className="text-5xl text-white font-semibold">
                {numberOfOrdersInLast24Hours}
              </p>
            </div>
          </div>
          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#383F51" }}
          >
            <div>
              <p className="text-white text-lg mb-3">
                Total Sales in Last 24 Hours
              </p>
              <p className="text-5xl text-white font-semibold ">
                {salesInLast24Hours}
              </p>
            </div>
          </div>

          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#368F8B" }}
          >
            <div>
              <p className="text-white text-lg mb-3">Number of Branches</p>
              <p className="text-5xl text-white font-semibold">
                {numberOfBranches}
              </p>
            </div>
          </div>
          <div
            className="relative flex w-1/4 p-5 rounded-lg shadow-md items-center gap-5 h-36 justify-between card"
            style={{ background: "#1f2937" }}
          >
            <div>
              <p className="text-white text-lg mb-3">Products In Store</p>
              <p className="text-5xl text-white font-semibold">
                {numberOfProducts}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-5 p-5 w-full justify-between">
        <Line/>
        <Chart />
        <ExpenseChart />
        <Donut />
      </div>
    </div>
  );
};

export default Dashboard;
