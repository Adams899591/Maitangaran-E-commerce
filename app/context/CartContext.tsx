import React, { createContext } from "react";

export const CartContext = createContext<{
  cartCount: any;
  setCartCount: React.Dispatch<React.SetStateAction<any>>;
} | null>(null);