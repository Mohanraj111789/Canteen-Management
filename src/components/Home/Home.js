import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductList from "../ProductList/ProductList";
import CartModal from "../CartModal/CartModal";
import ProductDetailModal from "../ProductDetail/ProductDetailModal";
import Footer from "../Footer/Footer";
import AdminPanel from "../AdminPanel/AdminPanel";
import UserOrderHistory from "./UserOrderHistory";
import useProducts from "../../hooks/useProducts";
import { ref, update } from "firebase/database";
import { auth, database } from "../../firebase";
import { signOut } from "firebase/auth";
import { Toast, Form, InputGroup, Container, Row, Col, Dropdown, Badge } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import jsPDF from "jspdf";
import useAdmin from "../../hooks/useAdmin";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products, loading, error } = useProducts();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCartModal, setShowCartModal] = useState(false);
  const [originalQuantities, setOriginalQuantities] = useState({});
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const isAdmin = useAdmin();

  useEffect(() => {
    if (products && products.length > 0) {
      const updatedQuantities = products.reduce((acc, product) => {
        acc[product.id] = product.quantity;
        return acc;
      }, {});
      setOriginalQuantities(updatedQuantities);
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const incrementQuantity = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity < product.quantity) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return prevCart;
    });
  };

  const decrementQuantity = (productId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          return prevCart.filter(item => item.id !== productId);
        }
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleCartClick = () => {
    if (cart.length > 0) {
      navigate('/payment', { 
        state: { 
          cart,
          totalAmount: calculateTotal(),
          userEmail: currentUser?.email 
        } 
      });
    } else {
      setShowCartModal(true);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  const handleLogout = async () => {
    try {
      setLogoutError("");
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setLogoutError("Failed to log out. Please try again.");
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setShowAdmin(true);
      setShowOrderHistory(false);
    }
  };

  const handleHomeClick = () => {
    setShowAdmin(false);
    setShowOrderHistory(false);
  };

  // Filter and sort products
  const filteredProducts = products ? products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (priceFilter === "all") return matchesSearch;
    if (priceFilter === "under50" && product.price < 50) return matchesSearch;
    if (priceFilter === "50to100" && product.price >= 50 && product.price <= 100) return matchesSearch;
    if (priceFilter === "over100" && product.price > 100) return matchesSearch;
    
    return false;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "quantity") return b.quantity - a.quantity;
    return 0;
  }) : [];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="px-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <Container>
          <Link to="/" className="navbar-brand fw-bold text-primary">
            Canteen Management
          </Link>

          <div className="d-flex align-items-center gap-3">
            <div 
              className="position-relative cart-icon-container" 
              onClick={handleCartClick}
              style={{ cursor: 'pointer' }}
            >
              <FaShoppingCart size={24} className="text-primary" />
              {getTotalCartItems() > 0 && (
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">
                  {getTotalCartItems()}
                </Badge>
              )}
            </div>

            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="user-dropdown" className="d-flex align-items-center gap-2">
                <FaUser /> {currentUser?.email}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                {isAdmin && (
                  <Dropdown.Item onClick={handleAdminClick}>
                    Admin Panel
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => setShowOrderHistory(true)}>
                  <FaHistory className="me-2" /> Order History
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </nav>

      {/* Search and Filter Section */}
      <div className="container mb-4">
        <Row className="g-3">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under50">Under ₹50</option>
              <option value="50to100">₹50 - ₹100</option>
              <option value="over100">Over ₹100</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="quantity">Quantity Available</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div className="container mb-4">
        {showAdmin ? (
          <AdminPanel onBack={() => setShowAdmin(false)} />
        ) : showOrderHistory ? (
          <UserOrderHistory onBack={() => setShowOrderHistory(false)} />
        ) : (
          <ProductList
            products={filteredProducts}
            addToCart={addToCart}
            onProductClick={handleProductClick}
            cart={cart}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
            removeFromCart={removeFromCart}
          />
        )}
      </div>

      {/* Modals and Toasts */}
      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cart={cart}
        updateQuantity={incrementQuantity}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
      />

      <ProductDetailModal
        show={showProductDetailModal}
        handleClose={() => setShowProductDetailModal(false)}
        product={selectedProduct}
        addToCart={addToCart}
      />

      <Toast
        show={showCheckoutToast}
        onClose={() => setShowCheckoutToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          minWidth: 200,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Checkout completed successfully!</Toast.Body>
      </Toast>

      <Footer />
    </Container>
  );
};

export default Home;
