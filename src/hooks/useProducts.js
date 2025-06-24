import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            price: Number(data[key].price) // Ensure price is a number
          }));
          setProducts(productList);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProductQuantity = (id, newQuantity) => {
    const productRef = ref(database, `products/${id}`);
    return update(productRef, { quantity: newQuantity })
      .then(() => {
        // Update local state
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === id ? { ...product, quantity: newQuantity } : product
          )
        );
      })
      .catch((error) => {
        console.error("Error updating product quantity:", error);
        throw error;
      });
  };

  return {
    products,
    loading,
    error,
    updateProductQuantity,
  };
};

export default useProducts;
