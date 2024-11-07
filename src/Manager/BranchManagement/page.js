import React, { useState, useEffect } from "react";
import { FcSettings } from "react-icons/fc";
import managerService from "../../Services/managerService";
import { BsClock } from "react-icons/bs";
import { IoTodayOutline } from "react-icons/io5";
import { BiDoorOpen } from "react-icons/bi";
import { BsDoorClosed } from "react-icons/bs";
import { Modal } from "react-bootstrap";

const BranchManagement = () => {
  const [branch, setBranch] = useState({});

  const [loading, setLoading] = useState(false);

  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [closeBranchModal, setCloseBranchModal] = useState(false);

  const [openingTimeModal, setOpeningTimeModal] = useState(false);
  const [closingTimeModal, setClosingTimeModal] = useState(false);

  const [cashInDrawerModal, setCashInDrawerModal] = useState(false);

  const [cashInDrawer, setCashInDrawer] = useState(0);

  const fetchData = async () => {
    const response = await managerService.getBranch();
    if (response && response.data) {
      setBranch(response.data);
      console.log(response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const updateCashOnHand = async () => {
    await managerService.updateCashOnHand(cashInDrawer);
    setCashInDrawerModal(false);
  };

  const openBranch = async () => {
    await updateCashOnHand();
    setOpenBranchModal(false);
    // setLoading(true);
    await managerService.openBranch();
    setBranch({ ...branch, shift_status: true });
    fetchData();
  };

  const closeBranch = async () => {
    await updateCashOnHand();
    setCloseBranchModal(false);
    // setLoading(true);
    await managerService.closeBranch();
    setBranch({ ...branch, shift_status: false });
    fetchData();
  };

  const branchTimingsChanged = (e) => {
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  const updateBranchTimings = async () => {
    await managerService.updateBranchTimings(branch);
    setClosingTimeModal(false);
    setOpeningTimeModal(false);
  };

  return (
    <div className="w-full flex flex-col min-h-screen p-20">
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
      <div className="flex flex-row justify-start items-center gap-5 mb-10">
        <FcSettings className="text-3xl" />
        <h1 className="text-3xl font-semibold text-gray-800">
          Branch Management
        </h1>
      </div>
      <div className="flex justify-end">
        {branch.shift_status ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setCashInDrawerModal(true);
              setCloseBranchModal(true);
            }}
          >
            Close Day
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setCashInDrawerModal(true);
              setOpenBranchModal(true);
            }}
          >
            Start Day
          </button>
        )}
      </div>
      <div className="table w-full mt-4 bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div className="table-row-group text-sm">
          <div className="table-row text-gray-200">
            <div className="table-cell font-bold text-center">Branch Name</div>
            <div className="table-cell font-bold text-center">
              Branch Location
            </div>
            <div className="table-cell font-bold text-center">Branch Phone</div>
            <div className="table-cell font-bold text-center">Day Number</div>
            <div className="table-cell font-bold text-center">
              Branch Shift Status
            </div>
            <div className="table-cell font-bold text-center">
              Branch Cash on Hand
            </div>
          </div>
          <div className=" mt-2"></div>
          <div className="table-row text-gray-300">
            <div className="table-cell text-center">{branch.branch_name}</div>
            <div className="table-cell text-center">{branch.address}</div>
            <div className="table-cell text-center">{branch.contact}</div>
            <div className="table-cell text-center">{branch.day_number}</div>
            <div className="table-cell text-center">
              {branch.shift_status ? "Open" : "Closed"}
            </div>
            <div className="table-cell text-center">{branch.cash_on_hand}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 gap-10">
        <div className="border p-10 rounded-lg bg-white shadow-lg dark:bg-gray-800 w-1/2">
          <div className="flex justify-between items-center text-white">
            <BsClock className="text-2xl" />
            <h2 className="text-2xl text-white">Opening Hours</h2>
            <button
              className="bg-transparent text-white rounded-lg"
              onClick={() => setOpeningTimeModal(true)}
            >
              Edit
            </button>
          </div>
          <div className="flex justify-center mt-5 text-white text-5xl">
            <h3>{branch.opening_time}</h3>
          </div>
        </div>
        <div className="border p-10 rounded-lg bg-white shadow-lg dark:bg-gray-800 w-1/2">
          <div className="flex justify-between items-center text-white">
            <BsClock className="text-2xl" />
            <h2 className="text-2xl text-white">Closing Hours</h2>
            <button
              className="bg-transparent text-white rounded-lg"
              onClick={() => setClosingTimeModal(true)}
            >
              Edit
            </button>
          </div>
          <div className="flex justify-center mt-5 text-white text-5xl">
            <h3>{branch.closing_time}</h3>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 gap-10">
        <div className="border p-10 rounded-lg bg-white shadow-lg dark:bg-gray-800 w-1/2">
          <h2 className="text-2xl text-white">Total Tables</h2>
          <div className="flex justify-between mt-5 text-white text-5xl">
            <h3>{branch.total_tables}</h3>
            <IoTodayOutline className="text-5xl" />
          </div>
        </div>
        <div className="border p-10 rounded-lg bg-white shadow-lg dark:bg-gray-800 w-1/2">
          <h2 className="text-2xl text-white">Branch Status</h2>
          <div className="flex justify-between mt-5 text-white text-5xl">
            <h3>{branch.shift_status ? "Open" : "Closed"}</h3>
            {branch.shift_status ? (
              <BiDoorOpen className="text-5xl" />
            ) : (
              <BsDoorClosed className="text-5xl" />
            )}
          </div>
        </div>
      </div>
      {openBranchModal || closeBranchModal ? (
        <div
          onClick={() => {
            setOpenBranchModal(false);
            setCloseBranchModal(false);
          }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
        ></div>
      ) : null}

      {openingTimeModal || closingTimeModal ? (
        <div
          onClick={() => {
            setOpeningTimeModal(false);
            setClosingTimeModal(false);
          }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
        ></div>
      ) : null}
      <Modal
        show={openBranchModal}
        onHide={() => setOpenBranchModal(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody pt-10 pb-10"
      >
        <Modal.Header closeButton>
          <Modal.Title>Open Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to open the branch?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={openBranch}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Open Branch
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={closeBranchModal}
        onHide={() => setCloseBranchModal(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header closeButton>
          <Modal.Title>Close Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to close the branch?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={closeBranch}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Close Branch
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={openingTimeModal}
        onHide={() => setOpeningTimeModal(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center font-semibold">
            Update {branch.branch_name} Opening Time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 flex justify-center">
          <input
            type="time"
            name="opening_time"
            value={branch.opening_time}
            onChange={branchTimingsChanged}
            className="border border-gray-300 rounded-lg p-2"
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-center w-full">
          <button
            onClick={updateBranchTimings}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-5 hover:bg-blue-600"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={closingTimeModal}
        onHide={() => setClosingTimeModal(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center font-semibold">
            Update {branch.branch_name} Closing Time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 flex justify-center">
          <div>
            <input
              type="time"
              name="closing_time"
              value={branch.closing_time}
              onChange={branchTimingsChanged}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center w-full">
          <button
            onClick={updateBranchTimings}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-5 hover:bg-blue-600"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={cashInDrawerModal}
        onHide={() => setCashInDrawerModal(false)}
        centered
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none rounded-2xl w-1/3 shadow-xl z-50 bg-white p-5 modal modalbody"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center font-semibold">
            Update Cash in Drawer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 flex justify-center">
          <div>
            <input
              type="number"
              name="cash_in_drawer"
              value={cashInDrawer}
              onChange={(e) => setCashInDrawer(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center w-full">
          <button
            onClick={() => setCashInDrawerModal(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-5 hover:bg-blue-600"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BranchManagement;
