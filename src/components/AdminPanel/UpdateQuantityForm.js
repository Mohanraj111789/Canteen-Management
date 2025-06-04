import React, { useState } from "react";
import { Card, Table, Button, Modal, Form, Badge, InputGroup } from "react-bootstrap";
import { ref, update, remove } from "firebase/database";
import { database } from "../../firebase";
import { FaEdit, FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const UpdateQuantityForm = ({ products, setProducts }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    initialPrice: "",
    quantity: "",
    description: "",
    image: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");

  const handleEditClick = (productId, product) => {
    setSelectedProduct(productId);
    setEditForm({
      name: product.name || "",
      price: product.price || "",
      initialPrice: product.initialPrice || product.initialPrices || "",
      quantity: product.quantity || 0,
      description: product.description || "",
      image: product.image || ""
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    setEditForm({
      name: "",
      price: "",
      initialPrice: "",
      quantity: "",
      description: "",
      image: ""
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const productRef = ref(database, `products/${selectedProduct}`);
      await update(productRef, {
        name: editForm.name,
        price: parseFloat(editForm.price),
        initialPrice: parseFloat(editForm.initialPrice),
        quantity: parseInt(editForm.quantity),
        description: editForm.description,
        image: editForm.image
      });

      alert("Product updated successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        const productRef = ref(database, `products/${productId}`);
        await remove(productRef);
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleQuickQuantityUpdate = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 0) {
      alert("Quantity cannot be negative!");
      return;
    }

    try {
      const productRef = ref(database, `products/${productId}`);
      await update(productRef, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: "Out of Stock", variant: "danger" };
    if (quantity < 10) return { text: "Low Stock", variant: "warning" };
    return { text: "In Stock", variant: "success" };
  };

  const filteredProducts = Object.entries(products || {}).filter(([id, product]) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStock === "outOfStock") {
      matchesFilter = product.quantity === 0;
    } else if (filterStock === "lowStock") {
      matchesFilter = product.quantity > 0 && product.quantity < 10;
    } else if (filterStock === "inStock") {
      matchesFilter = product.quantity >= 10;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product Management</h5>
          <Badge bg="info">{Object.keys(products || {}).length} Total Products</Badge>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <div className="mb-3">
            <div className="row g-3">
              <div className="col-md-6">
                <InputGroup>
                  <InputGroup.Text>Search</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="col-md-6">
                <InputGroup>
                  <InputGroup.Text>Filter</InputGroup.Text>
                  <Form.Select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                  >
                    <option value="all">All Products</option>
                    <option value="inStock">In Stock (≥10)</option>
                    <option value="lowStock">Low Stock (&lt;10)</option>
                    <option value="outOfStock">Out of Stock</option>
                  </Form.Select>
                </InputGroup>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price (₹)</th>
                  <th>Initial Price (₹)</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(([id, product]) => {
                    const stockStatus = getStockStatus(product.quantity || 0);
                    return (
                      <tr key={id}>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        </td>
                        <td><strong>{product.name}</strong></td>
                        <td>₹{product.price}</td>
                        <td>₹{product.initialPrice || product.initialPrices || 0}</td>
                        <td>
                          <strong>{product.quantity || 0}</strong>
                        </td>
                        <td>
                          <Badge bg={stockStatus.variant}>{stockStatus.text}</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleQuickQuantityUpdate(id, product.quantity || 0, 10)}
                              title="Add 10"
                            >
                              <FaPlus /> 10
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleQuickQuantityUpdate(id, product.quantity || 0, -10)}
                              title="Remove 10"
                              disabled={(product.quantity || 0) < 10}
                            >
                              <FaMinus /> 10
                            </Button>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditClick(id, product)}
                            >
                              <FaEdit /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteProduct(id, product.name)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Current Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={editForm.price}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Initial Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="initialPrice"
                    step="0.01"
                    min="0"
                    value={editForm.initialPrice}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="0"
                value={editForm.quantity}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={editForm.description}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={editForm.image}
                onChange={handleFormChange}
                required
              />
              {editForm.image && (
                <div className="mt-2">
                  <img
                    src={editForm.image}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateQuantityForm;
