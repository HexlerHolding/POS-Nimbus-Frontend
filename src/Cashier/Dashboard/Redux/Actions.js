export const addToCart = (product, quantity = 1) => ({
  type: "ADD_TO_CART",
  payload: { product, quantity },
});

export const removeFromCart = (productId) => ({
  type: "REMOVE_FROM_CART",
  payload: productId,
});

export const updateQuantity = (productId, quantity) => ({
  type: "UPDATE_QUANTITY",
  payload: { productId, quantity },
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});
