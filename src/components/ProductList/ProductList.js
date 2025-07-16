import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductList.css";
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash, FaInfoCircle, FaShoppingCart } from 'react-icons/fa';

const ProductList = ({ products, addToCart, onProductClick, cart = [], incrementQuantity, decrementQuantity, removeFromCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>No products found</h3>
        <p className="text-muted">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  const getQuantityInCart = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {products.map((product) => {
        const quantityInCart = getQuantityInCart(product.id);
        const isInCart = quantityInCart > 0;

        return (
          <Col key={product.id}>
            <Card className="h-100 product-card">
              {isInCart && (
                <div className="cart-badge">
                  <Badge bg="primary">
                    <FaShoppingCart className="me-1" />
                    {quantityInCart}
                  </Badge>
                </div>
              )}
              <Card.Img
                variant="top"
                src={product.image}
                className="product-image"
                alt={product.name}
                onClick={() => onProductClick(product)}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="product-title">{product.name}</Card.Title>
                <Card.Text className="product-description">{product.description}</Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="price">₹{product.price.toFixed(2)}</span>
                    <span className={`stock ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.quantity > 0 ? `${product.quantity} left` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline-secondary"
                    className="w-100 mb-2 view-details-btn"
                    onClick={() => onProductClick(product)}
                  >
                    <FaInfoCircle className="me-2" /> View Details
                  </Button>
                  
                  {isInCart ? (
                    <div className="quantity-controls">
                      <div className="quantity-label mb-2">Quantity in Cart:</div>
                      <div className="quantity-actions">
                        <div className="quantity-row d-flex align-items-center justify-content-between mb-2">
                          <Button 
                            variant="primary" 
                            onClick={() => decrementQuantity(product.id)}
                            className="quantity-btn"
                            title="Decrease quantity"
                          >
                            <div className="d-flex flex-column align-items-center">
                              <FaMinus className="quantity-icon" />
                              <span className="quantity-btn-text"></span>
                            </div>
                          </Button>
                          <span className="quantity-display">{quantityInCart}</span>
                          <Button 
                            variant="primary" 
                            onClick={() => incrementQuantity(product.id)}
                            disabled={quantityInCart >= product.quantity}
                            className="quantity-btn"
                            title="Increase quantity"
                          >
                            <div className="d-flex flex-column align-items-center">
                              <FaPlus className="quantity-icon" />
                              <span className="quantity-btn-text"></span>
                            </div>
                          </Button>
                        </div>
                        <Button 
                          variant="danger" 
                          onClick={() => removeFromCart(product.id)}
                          className="remove-btn w-100"
                          title="Remove from cart"
                        >
                          <FaTrash className="me-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => addToCart(product)}
                      disabled={product.quantity === 0}
                      className="w-100 add-to-cart-btn"
                    >
                      <FaShoppingCart className="me-2" /> Add to Cart
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ProductList;
