import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBill, FaMobile } from 'react-icons/fa';
import './PaymentGateway.css';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalAmount, userEmail } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('mohan@upi');
  const [loading, setLoading] = useState(false);

  if (!cart || cart.length === 0) {
    navigate('/'); // Redirect to home if no cart data
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to success page with order details
      navigate('/order-success', {
        state: {
          orderId: Date.now().toString(),
          orderDetails: {
            items: cart,
            totalAmount,
            paymentMethod: paymentMethod.toUpperCase(),
            upiId: paymentMethod === 'upi' ? upiId : undefined,
            timestamp: new Date().toISOString(),
          }
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% tax
  };

  return (
    <Container className="py-5 position-relative">
      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.7)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Spinner animation="border" role="status" style={{ width: 60, height: 60 }}>
            <span className="visually-hidden">Processing...</span>
          </Spinner>
        </div>
      )}
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Payment Method</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePayment}>
                <div className="payment-methods">
                  <Form.Check
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    label={
                      <div className="d-flex align-items-center">
                        <FaMobile className="me-2" />
                        <span>UPI Payment</span>
                      </div>
                    }
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-3"
                  />
                  {paymentMethod === 'upi' && (
                    <Form.Group className="mb-3 ms-4">
                      <Form.Control
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID"
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Default UPI ID is set to mohan@upi
                      </Form.Text>
                    </Form.Group>
                  )}
                  <Form.Check
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    label={
                      <div className="d-flex align-items-center">
                        <FaCreditCard className="me-2" />
                        <span>Card Payment</span>
                      </div>
                    }
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-3"
                  />
                  <Form.Check
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    label={
                      <div className="d-flex align-items-center">
                        <FaMoneyBill className="me-2" />
                        <span>Cash Payment</span>
                      </div>
                    }
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-3"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mt-3"
                  disabled={loading || !paymentMethod}
                >
                  {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Quantity: {item.quantity}</small>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%)</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentGateway; 