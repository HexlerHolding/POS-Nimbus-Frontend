const initialState = {
  items: [], // items in cart
  total: 0, // total product_price
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const newProduct = action.payload.product;
      const quantity = action.payload.quantity;
      let existItem = state.items.find((item) => item.id === newProduct.id);

      if (existItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === newProduct.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          total: state.total + newProduct.product_price * quantity,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...newProduct, quantity }],
        total: state.total + newProduct.product_price * quantity,
      };

    case "REMOVE_FROM_CART":
      //if item already exists in cart
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      if (itemToRemove) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload),
          total: state.total - itemToRemove.product_price * itemToRemove.quantity,
        };
      }

      return state;

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        //remove item from cart
        const itemToRemove = state.items.find(
          (item) => item.id === action.payload.productId
        );
        return {
          ...state,
          items: state.items.filter(
            (item) => item.id !== action.payload.productId
          ),
          total: state.total - itemToRemove.product_price * itemToRemove.quantity,
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((total, item) => {
          if (item.id === action.payload.productId) {
            return total + item.product_price * action.payload.quantity;
          }
          return total + item.product_price * item.quantity;
        }, 0),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
      };

    default:
      return state;
  }
}

export default cartReducer;
