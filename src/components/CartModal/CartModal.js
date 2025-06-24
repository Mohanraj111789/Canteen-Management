import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Modal, Button } from 'react-bootstrap';
import './CartModal.css';

const CartModal = ({ 
  show, 
  onHide, 
  cart, 
  updateQuantity, 
  removeFromCart, 
  calculateTotal
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const subtotal = calculateTotal();
  const tax = subtotal * 0.05; // 5% tax
  
  // Calculate discount based on coupon
  let discount = 0;
  if (appliedCoupon === 'WELCOME10') {
    discount = subtotal * 0.1; // 10% off
  } else if (appliedCoupon === 'FLAT50' && subtotal >= 500) {
    discount = 50; // ₹50 off on orders above ₹500
  }

  const total = subtotal + tax - discount;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCouponApply = () => {
    setCouponError('');
    const couponInput = document.getElementById('coupon');
    if (!couponInput) return;

    const couponCode = couponInput.value.trim().toUpperCase();
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    if (couponCode === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
    } else if (couponCode === 'FLAT50') {
      if (subtotal >= 500) {
        setAppliedCoupon('FLAT50');
      } else {
        setCouponError('This coupon is valid only for orders above ₹500');
      }
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      onHide();
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Navigate to payment page with cart details
    onHide();
    navigate('/payment', {
      state: {
        cart,
        totalAmount: total,
        userEmail: currentUser?.email,
        appliedCoupon,
        subtotal,
        tax,
        discount
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {cart.length === 0 ? (
          <div className="empty-cart text-center py-4">
            <p className="mb-4">Your cart is empty</p>
            <Button variant="primary" onClick={onHide}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="price">₹{item.price}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        
                      </Button>
                      <span className="quantity">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        
                      </Button>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="coupon-section mt-4">
              <div className="coupon-input">
                <input
                  type="text"
                  id="coupon"
                  placeholder="Enter coupon code"
                  className="form-control"
                />
                <Button variant="secondary" onClick={handleCouponApply}>
                  Apply
                </Button>
              </div>
              {couponError && <p className="text-danger mt-2">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-success mt-2">
                  Coupon {appliedCoupon} applied successfully!
                </p>
              )}
            </div>

            <div className="cart-summary mt-4">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </Modal.Body>

      {cart.length > 0 && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Continue Shopping
          </Button>
          <Button 
            variant="primary"
            onClick={handleCheckout}
          >
            Proceed to Checkout (₹{total.toFixed(2)})
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
