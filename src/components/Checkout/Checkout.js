import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const PAYMENT_METHODS = {
  UPI: {
    name: 'UPI Payment',
    icon: '📱',
    description: 'Pay using UPI ID: canteen@okaxis',
    defaultId: 'canteen@okaxis',
    enabled: true
  },
  CARD: {
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Pay using Credit or Debit card',
    enabled: true
  },
  NET_BANKING: {
    name: 'Net Banking',
    icon: '🏦',
    description: 'Pay using Net Banking',
    enabled: true
  }
};

const Checkout = ({ cart, totalAmount, clearCart }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPayment(method);
    setError('');
  };

  const handlePaymentConfirm = () => {
    if (!selectedPayment) {
      setError('Please select a payment method');
      return;
    }
    setShowPaymentConfirm(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock order data for success page
      const orderData = {
        items: cart,
        paymentMethod: selectedPayment,
        totalAmount,
        status: 'success',
        timestamp: Date.now()
      };

      // Add method-specific details
      if (selectedPayment === 'UPI') {
        orderData.upiId = PAYMENT_METHODS.UPI.defaultId;
      } else if (selectedPayment === 'CARD') {
        orderData.cardType = 'Test Card';
        orderData.lastFourDigits = '****';
      } else if (selectedPayment === 'NET_BANKING') {
        orderData.bankName = 'Test Bank';
      }

      // Clear cart and navigate to success
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: 'TEST-' + Date.now(),
          orderDetails: orderData 
        } 
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="checkout-container">
      <h2>Select Payment Method</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="payment-methods">
        {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
          <div 
            key={key}
            className={`payment-method ${selectedPayment === key ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodSelect(key)}
          >
            <div className="payment-method-header">
              <span className="payment-icon">{method.icon}</span>
              <h3>{method.name}</h3>
            </div>
            <p className="payment-description">{method.description}</p>
            {key === 'UPI' && selectedPayment === key && (
              <div className="upi-details">
                <input 
                  type="text" 
                  value={method.defaultId}
                  readOnly
                  className="upi-id-input"
                />
                <small>This is the official canteen UPI ID</small>
              </div>
            )}
            {key === 'CARD' && selectedPayment === key && (
              <div className="card-details">
                <p className="test-mode-notice">Test Mode: All card payments will auto-succeed</p>
              </div>
            )}
            {key === 'NET_BANKING' && selectedPayment === key && (
              <div className="netbanking-details">
                <p className="test-mode-notice">Test Mode: All bank payments will auto-succeed</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="total">
          <span>Total Amount:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {showPaymentConfirm && (
        <div className="payment-confirm">
          <h4>Confirm {PAYMENT_METHODS[selectedPayment].name}</h4>
          <p>Click 'Pay Now' to simulate a successful payment for testing.</p>
          <div className="payment-confirm-actions">
            <button 
              className="btn-secondary"
              onClick={() => setShowPaymentConfirm(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}

      <div className="checkout-actions">
        <button 
          className="btn-secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Back to Cart
        </button>
        {!showPaymentConfirm && (
          <button
            className="btn-primary"
            onClick={handlePaymentConfirm}
            disabled={!selectedPayment || loading}
          >
            {loading ? 'Processing...' : `Proceed to Pay ₹${totalAmount}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;