import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const convertIDtoSmall = (id) => {
  //hash the id to a 2 digit number
  let number = 0;
  for (let i = 0; i < id.length; i++) {
    number += id.charCodeAt(i);
  }
  return number % 100;
};
const commonService = {
  handleID: (id) => {
    return convertIDtoSmall(id);
  },
};

export default commonService;
