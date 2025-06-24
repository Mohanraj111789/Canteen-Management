import React from "react";
import { Modal, Button } from "react-bootstrap";
import Reviews from "../Reviews/Reviews";

const ProductDetailModal = ({ show, handleClose, product, addToCart }) => {
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <h4 className="mb-3">Product Details</h4>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Available Quantity:</strong> {product.quantity}</p>
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="w-100 mb-3"
            >
              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <Reviews productId={product.id} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProductDetailModal;
