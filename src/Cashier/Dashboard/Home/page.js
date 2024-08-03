import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../Redux/Actions";
import managerService from "../../../Services/managerService";
import { BiPlus } from "react-icons/bi";
import { BiMinus } from "react-icons/bi";
import { BsCart } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import { Modal } from "react-bootstrap";

const Home = () => {
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

  const getProducts = () => {
    managerService.getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.data);
        setProducts(data.data.products);
      }
    });
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [markedCompleted, setMarkedCompleted] = useState(false);
  const [markedDone, setMarkedDone] = useState(false);
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    managerService.getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.data);
        setProducts(data.data.products);
        setFilteredProducts(data.data.products);
      }
    });
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

  useEffect(() => {
    setFilter("");
  }, []);

  const cart = useSelector((state) => state.cart);

  const [inBranch, setInBranch] = useState(true);

  const [order_types, setOrderTypes] = useState([
    "Delivery",
    "Takeaway",
    "Dine-in",
  ]);

  const [payment_methods, setPaymentMethods] = useState([
    "Cash",
    "Credit Card",
  ]);

  //console log the cart

  useEffect(() => {
    console.log(cart);
  }, [cart]);
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
              key={product.id}
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
      <div className="p-20 bg-white w-1/3 cart fixed right-0 top-0 h-full border-l">
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
            className="bg-green-500 text-white p-2 rounded hover:bg-red-600"
            onClick={() => setShowDetailsForm(true)}
          >
            Checkout
          </button>
        </div>
        <div className="border-t p-4">
          <div className="flex justify-between">
            <h3 className="text-xl text-blue-500">Active Orders</h3>
            <h3 className="">
              {activeOrders.length}{" "}
              <span className="text-blue-700">Active Orders</span>
            </h3>
          </div>
          <div className="overflow-y-auto h-72 no-scrollbar flex flex-col justify-between">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-dashed p-4 flex flex-col text-center rounded-lg mt-10 me-4"
              >
                <p className="text-gray-700 flex justify-between">
                  Customer{" "}
                  <span className="text-blue-600">{order.customerName}</span>
                </p>
                <p className="text-gray-700 text-left text-sm mt-2 mb-2">
                  Time: {new Date(order.timeDate).toLocaleString()}
                </p>
                <div className="flex flex-col">
                  {order.products.map((product) => (
                    <div key={product.id} className="flex justify-between">
                      <p>{product.name}</p>
                      <p>PKR {product.price}/-</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p>Total: PKR {order.total}/-</p>
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
                    onClick={() => setMarkedCompleted(true)}
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
                    setDetails({ ...details, address: e.target.value })
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
            onClick={(e) => {
              e.preventDefault();
              console.log(details);
              setShowDetailsForm(false);
            }}
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
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-1/2"
            onClick={() => setMarkedCompleted(false)}
          >
            No
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-1/2"
            onClick={(e) => {
              e.preventDefault();
              console.log("Order marked as completed");
              setMarkedCompleted(false);
              setMarkedDone(true);
            }}
          >
            Yes
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
    </div>
  );
};

export default Home;
