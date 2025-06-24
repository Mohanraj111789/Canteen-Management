import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDetails } = location.state || {};
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!orderId || !orderDetails) {
    navigate('/');
    return null;
  }

  const generateInvoicePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice', pageWidth / 2, yPos, { align: 'center' });
      
      // Order Details
      yPos += 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Order ID: ${orderId}`, 20, yPos);
      doc.text(`Date: ${new Date(orderDetails.timestamp).toLocaleDateString()}`, 20, yPos + 10);

      // Items Table
      yPos += 30;
      doc.setFont('helvetica', 'bold');
      doc.text('Order Items', 20, yPos);
      yPos += 10;
      
      // Table Header
      const columns = ['Item', 'Quantity', 'Price', 'Total'];
      const columnWidths = [80, 30, 30, 30];
      let xPos = 20;
      
      columns.forEach((column, index) => {
        doc.text(column, xPos, yPos);
        xPos += columnWidths[index];
      });

      // Table Content
      doc.setFont('helvetica', 'normal');
      orderDetails.items.forEach((item, index) => {
        yPos += 10;
        xPos = 20;
        doc.text(item.name, xPos, yPos);
        doc.text(item.quantity.toString(), xPos + columnWidths[0], yPos);
        doc.text(`₹${item.price}`, xPos + columnWidths[0] + columnWidths[1], yPos);
        doc.text(`₹${item.price * item.quantity}`, xPos + columnWidths[0] + columnWidths[1] + columnWidths[2], yPos);
      });

      // Summary
      yPos += 30;
      doc.setFont('helvetica', 'bold');
      doc.text('Order Summary', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 10;
      doc.text(`Subtotal: ₹${orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0)}`, 20, yPos);
      yPos += 10;
      doc.text(`Tax (5%): ₹${(orderDetails.totalAmount - orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2)}`, 20, yPos);
      yPos += 10;
      doc.text(`Total Amount: ₹${orderDetails.totalAmount}`, 20, yPos);

      // Payment Details
      yPos += 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 10;
      doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, yPos);
      if (orderDetails.paymentMethod === 'UPI') {
        doc.text(`UPI ID: ${orderDetails.upiId}`, 20, yPos + 10);
      }

      // Footer
      yPos = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(10);
      doc.text('Thank you for your order!', pageWidth / 2, yPos, { align: 'center' });

      // Save the PDF
      doc.save(`invoice-${orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="success-card">
        <Card.Body>
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order. Your order has been placed successfully.</p>
          </div>

          <div className="order-info">
            <div className="info-row">
              <span>Order ID:</span>
              <span>{orderId}</span>
            </div>
            <div className="info-row">
              <span>Total Amount:</span>
              <span>₹{orderDetails.totalAmount}</span>
            </div>
            <div className="info-row">
              <span>Date:</span>
              <span>{new Date(orderDetails.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {orderDetails.items.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="payment-info">
            <h3>Payment Details</h3>
            <p>Payment Method: {orderDetails.paymentMethod}</p>
            {orderDetails.paymentMethod === 'UPI' && (
              <p>UPI ID: {orderDetails.upiId}</p>
            )}
          </div>

          <div className="action-buttons">
            <Button 
              variant="secondary"
              onClick={() => navigate('/')}
              className="me-2"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="primary"
              onClick={generateInvoicePDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating Invoice...' : 'Download Invoice'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderSuccess; 