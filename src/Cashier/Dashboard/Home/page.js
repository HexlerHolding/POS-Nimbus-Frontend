import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../Redux/Actions";
import { BiPlus } from "react-icons/bi";
import { BiMinus } from "react-icons/bi";
import { BsCart } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import { Modal } from "react-bootstrap";

import CashierService from "../../../Services/cashierService";

const Home = () => {
  const [branchStatus, setBranchStatus] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [details, setDetails] = useState({
    customerName: "",
    discount: 0,
    address: "",
    order_type: "",
    tax: 0,
    payment_method: "",
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [markedCompleted, setMarkedCompleted] = useState(false);
  const [markedDone, setMarkedDone] = useState(false);
  const [filter, setFilter] = useState("");
  const [inBranch, setInBranch] = useState(true);
  const [orderToComplete, setOrderToComplete] = useState("");

  const [showBranchIsClosed, setShowBranchIsClosed] = useState(false);
  const dispatch = useDispatch();

  const getProducts = async () => {
    const response = await CashierService.getProducts();
    if (response.error) {
      console.log(response.error);
    } else {
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    }
  };

  const sortActiveOrders = (orders) => {
    // sort based on ready first and then earliest within
    orders.sort((a, b) => {
      if (a.status === "pending" && b.status === "ready") {
        return -1;
      } else if (a.status === "ready" && b.status === "pending") {
        return 1;
      } else {
        return a.time - b.time;
      }
    });

    setActiveOrders(orders);
  };

  const getActiveOrders = async () => {
    const response = await CashierService.getActiveOrders();
    if (response.error) {
      console.log(response.error);
    } else {
      console.log(response.data);
      sortActiveOrders(response.data);
    }
  };

  const getBranchStatus = async () => {
    const response = await CashierService.getBranchStatus();
    if (response.error) {
      console.log(response.error);
    } else {
      console.log(response.data);
      if (!response.data.status) {
        setShowBranchIsClosed(true);
      } else {
        setShowBranchIsClosed(false);
      }
    }
  };

  //get branch status every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getBranchStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //get active orders every 5 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      getActiveOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inBranch) {
      setDetails({ ...details, address: "In Branch" });
    } else {
      setDetails({ ...details, address: "" });
    }
  }, [inBranch]);

  useEffect(() => {
    getProducts();
    getActiveOrders();
    setFilter("");
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log("Product added to cart", product);
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
    console.log("Product removed from cart", product);
  };

  const handleUpdateQuantity = (product, quantity) => {
    dispatch(updateQuantity(product._id, quantity));
    console.log("Product quantity updated", product, quantity);
  };

  const handleCheckout = async () => {
    const order = {
      products: cart.items,
      total: cart.total,
      customer_name: details.customerName,
      payment_method: details.payment_method,
      order_type: details.order_type,
      tax: details.tax,
      discount: details.discount,
      address: details.address,
    };
    const response = await CashierService.addOrder(order);
    if (response.error) {
      console.log(response.error);
    } else {
      console.log(response.data);
      setShowDetailsForm(false);
      console.log(response.data);
      setActiveOrders([...activeOrders, response.data.order]);
      dispatch(clearCart());
      //clear details
      setDetails({
        customerName: "",
        discount: 0,
        address: "",
        order_type: "",
        tax: 0,
        payment_method: "",
      });

      setInBranch(true);
    }
  };

  useEffect(() => {
    console.log(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const cart = useSelector((state) => state.cart);

  const [order_types, setOrderTypes] = useState([
    "delivery",
    "takeaway",
    "dine-in",
  ]);

  const [payment_methods, setPaymentMethods] = useState(["cash", "card"]);

  //console log the cart

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const handleCompleteOrder = async () => {
    try {
      console.log(orderToComplete);
      const res = await CashierService.markOrderCompleted(orderToComplete);
      if (res.error) {
        console.log(res.error);
        return;
      } else {
        console.log(res.data);
      }
      setActiveOrders(
        activeOrders.filter((order) => order._id !== orderToComplete)
      );
      setMarkedCompleted(false);
      setMarkedDone(true);
      setOrderToComplete("");
    } catch (error) {
      console.log(error);
    }
  };

  const [card_tax, setCard_tax] = useState(0);
  const [cash_tax, setCash_tax] = useState(0);

  useEffect(() => {
    try {
      //get taxes for card and cash from backend
      CashierService.getTaxes().then((response) => {
        if (response.data) {
          setCard_tax(response.data.card_tax);
          setCash_tax(response.data.cash_tax);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="home flex">
      <div className="p-20 bg-white w-2/3">
        <h1 className="text-xl text-blue-500">Products</h1>
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded w-full mt-3 mb-3"
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border p-4 flex flex-col text-center rounded-lg"
            >
              <h3 className="text-gray-700">{product.name}</h3>
              <p>PKR {product.price}/-</p>
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={() => handleAddToCart(product)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-20 bg-white w-1/3 cart fixed right-0 top-0 h-screen border-l overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl text-blue-500 mb-3">Cart</h1>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </div>
        <div className="overflow-y-auto h-72">
          {cart.items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <BsCart className="text-6xl text-gray-300" />
              <h3 className="text-center">Cart is empty</h3>
            </div>
          )}

          {cart.items.map((item) => (
            <div
              key={item._id}
              className="border p-4 flex items-center justify-between text-center rounded-lg h-20"
            >
              <h3 className="text-gray-700">{item.name}</h3>
              <p>PKR {item.price}/-</p>
              <p className="flex items-center justify-center">
                <BiMinus
                  className="cursor-pointer mr-2"
                  onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                />
                {item.quantity}
                <BiPlus
                  className="cursor-pointer ml-2"
                  onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                />
              </p>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex justify-between items-center">
          <p className="text-gray-700">Total: PKR {cart.total}/-</p>
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
            onClick={() => setShowDetailsForm(true)}
          >
            Checkout
          </button>
        </div>
        <div className="border-t p-4">
          <div className="flex justify-between">
            <h3 className="text-xl text-blue-500">Active Orders</h3>
            <h3 className="">
              {activeOrders ? activeOrders.length : 0}{" "}
              <span className="text-blue-700">Order(s)</span>
            </h3>
          </div>
          <div className="overflow-y-auto h-72 no-scrollbar flex flex-col justify-between">
            {activeOrders &&
              activeOrders.map((order) => (
                <div
                  key={order._id}
                  className="relative border-2 border-dashed p-4 flex flex-col text-center rounded-lg mt-10 me-4"
                >
                  <div
                    className={`absolute top-2 right-2 w-4 h-4 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-300"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <p className=" flex flex-row text-gray-700 justify-left gap-1">
                    <p>Customer name:</p>
                    <span className="text-blue-600">{order.customer_name}</span>
                  </p>
                  <p className="text-gray-700 text-left text-sm mt-2 mb-2">
                    Time: {new Date(order.time).toLocaleString()}
                  </p>
                  <div className="flex flex-col">
                    {order.cart.map((orderItem) => (
                      <div key={orderItem._id} className="flex justify-between">
                        <p>{orderItem.product_name}</p>
                        <p>PKR {orderItem.price}/-</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p>
                      Total: PKR{" "}
                      {order.payment_method === "card"
                        ? (
                            order.total +
                            (order.total * card_tax) / 100
                          ).toFixed(2)
                        : (
                            order.total +
                            (order.total * cash_tax) / 100
                          ).toFixed(2)}
                    </p>
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
                      onClick={() => {
                        setOrderToComplete(order._id);
                        setMarkedCompleted(true);
                      }}
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {showDetailsForm && (
        //overlay
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={() => setShowDetailsForm(false)}
        ></div>
      )}
      {markedCompleted && (
        //overlay
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={() => setMarkedCompleted(false)}
        ></div>
      )}
      {markedDone && (
        //overlay
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={() => setMarkedDone(false)}
        ></div>
      )}

      {showBranchIsClosed && (
        //overlay
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"></div>
      )}

      <Modal
        show={showDetailsForm}
        onHide={() => setShowDetailsForm(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/2 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header className="flex justify-between mb-5">
          <Modal.Title className="text-xl text-blue-500">
            Order Details
          </Modal.Title>
          <div className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setInBranch(e.target.checked)}
              className="form-check-input"
              id="inBranch"
              value={inBranch}
            />
            <label htmlFor="inBranch" className="form-check-label mb-1 ml-2">
              In Branch
            </label>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="flex justify-between gap-4">
              <div className="mb-3 w-1/2">
                <label htmlFor="customerName" className="form-label">
                  Customer Name
                </label>
                <input
                  type="text"
                  className="form-control border border-gray-300 w-full p-2 rounded mt-2"
                  id="customerName"
                  value={details.customerName}
                  onChange={(e) =>
                    setDetails({ ...details, customerName: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 w-1/2">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className={`form-control border border-gray-300 w-full p-2 rounded mt-2 ${
                    inBranch ? "disabled" : ""
                  }`}
                  id="address"
                  disabled={inBranch}
                  value={details.address}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="mb-3 w-1/2">
                <label htmlFor="discount" className="form-label">
                  Discount
                </label>
                <input
                  type="number"
                  className="form-control border border-gray-300 w-full p-2 rounded mt-2"
                  id="discount"
                  value={details.discount}
                  onChange={(e) =>
                    setDetails({ ...details, discount: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 w-1/2">
                <label htmlFor="tax" className="form-label">
                  Tax
                </label>
                <input
                  type="number"
                  className="form-control border border-gray-300 w-full p-2 rounded mt-2"
                  id="tax"
                  value={details.tax}
                  onChange={(e) =>
                    setDetails({ ...details, tax: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="order_type" className="form-label">
                Select Order Type
              </label>
              <div className="mt-2 flex gap-2 items-center">
                {order_types.map((order_type) => (
                  <button
                    key={order_type}
                    className={`btn ${
                      details.order_type === order_type
                        ? "bg-blue-500 text-white px-3 py-2 rounded"
                        : "btn-outline-primary"
                    } me-2`}
                    onClick={(e) => {
                      e.preventDefault();
                      setDetails({ ...details, order_type: order_type });
                    }}
                  >
                    {order_type}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="payment_method" className="form-label">
                Payment Method
              </label>
              <div className="mt-2 flex gap-2 items-center">
                {payment_methods.map((payment_method) => (
                  <button
                    key={payment_method}
                    className={`btn ${
                      details.payment_method === payment_method
                        ? "bg-blue-500 text-white px-3 py-2 rounded"
                        : "btn-outline-primary"
                    } me-2`}
                    onClick={(e) => {
                      e.preventDefault();
                      setDetails({
                        ...details,
                        payment_method: payment_method,
                      });
                    }}
                  >
                    {payment_method}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-between mt-5 border-t pt-3 gap-5">
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-1/2"
            onClick={() => setShowDetailsForm(false)}
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-1/2"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={markedCompleted}
        onHide={() => setMarkedCompleted(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header className="flex justify-between mb-5">
          <Modal.Title className="text-xl text-blue-500">
            Mark Order Completed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to mark this order as completed?</p>
        </Modal.Body>
        <Modal.Footer className="flex justify-between mt-5 border-t pt-3 gap-5">
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-1/2"
            onClick={handleCompleteOrder}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-1/2"
            onClick={() => setMarkedCompleted(false)}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={markedDone}
        onHide={() => setMarkedDone(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header className="flex justify-between mb-5">
          <Modal.Title className="text-xl text-blue-500">
            Order Completed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center justify-center gap-5">
          <HiBadgeCheck className="text-8xl text-blue-500" />
          <p>Order has been marked as completed</p>
        </Modal.Body>
        <Modal.Footer className="flex justify-between mt-5 border-t pt-3 gap-5">
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full"
            onClick={() => setMarkedDone(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showBranchIsClosed}
        onHide={() => setShowBranchIsClosed(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header className="flex justify-between mb-5">
          <Modal.Title className="text-xl text-blue-500">
            Branch Closed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center justify-center gap-5">
          <HiBadgeCheck className="text-8xl text-blue-500" />
          <p>Branch is currently closed</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
