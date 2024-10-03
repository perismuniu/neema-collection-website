import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, XCircle } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Switch, Textarea } from '../products/UIComponents';
import { ToastContainer, toast } from 'react-toastify';
import api from '../utils/api'

const ProductItem = ({ product, onEdit, onDelete, onToggleActive }) => {
  // Calculate total stock across all variants
  const totalStock = product.variants.reduce((acc, variant) => {
    return acc + variant.stock.reduce((stockAcc, stockItem) => {
      return stockAcc + stockItem.quantity;
    }, 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
    >
      <div>
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-600">
          Price: KsHs{product.price.toFixed(2)} | Total Stock: {totalStock}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={product.active}
          onCheckedChange={() => onToggleActive(product._id)}
        />
        <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
          <Edit size={16} className="text-blue-500" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(product)}>
          <Trash2 size={16} className="text-red-500" />
        </Button>
      </div>
    </motion.div>
  );
};



// Form component for adding/editing products
const ProductForm = ({ product, onSave, onCancel, isEditing }) => {
  // Initialize form with empty values or existing product
  const [formData, setFormData] = useState(product || {
    title: '',
    description: '',
    price: '',
    variants: [],
    images: [''],
  });
 // Handle form field changes
 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

  // Handle variant changes
  const handleVariantChange = (variantIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex ? { ...variant, [field]: value } : variant
      )
    }));
  };

 // Handle stock changes within variants
 const handleStockChange = (variantIndex, stockIndex, field, value) => {
  setFormData(prev => ({
    ...prev,
    variants: prev.variants.map((variant, i) => 
      i === variantIndex
        ? {
            ...variant,
            stock: Array.isArray(variant.stock) 
              ? variant.stock.map((stock, j) =>
                  j === stockIndex ? { ...stock, [field]: field === 'quantity' ? parseInt(value, 10) : value } : stock
                )
              : [{ [field]: field === 'quantity' ? parseInt(value, 10) : value }]
          }
        : variant
    )
  }));
};

  const validateVariants = () => {
    for (const variant of formData.variants) {
      if (!variant.color || !Array.isArray(variant.stock) || variant.stock.some(stock => !stock.size || stock.quantity === '')) {
        return false;
      }
    }
    return true;
  };

  const addVariant = () => {
    if (!validateVariants()) {
      toast.error('Please fill all required fields in existing variants before adding a new one.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '', stock: [{ size: 'M', quantity: 0 }] }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addStock = (variantIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === variantIndex
          ? { ...variant, stock: Array.isArray(variant.stock) ? [...variant.stock, { size: 'M', quantity: 0 }] : [{ size: 'M', quantity: 0 }] }
          : variant
      )
    }));
  };

  const removeStock = (variantIndex, stockIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === variantIndex
          ? { ...variant, stock: Array.isArray(variant.stock) ? variant.stock.filter((_, j) => j !== stockIndex) : [] }
          : variant
      )
    }));
  };

   // Form submission handler
   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateVariants()) {
      toast.error('Please fill all required fields in all variants.');
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/products/${product._id}`, formData);
        toast.success('Product updated successfully!');
      } else {
        response = await api.post('/products', formData);
        toast.success('Product added successfully!');
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || 'Error saving product!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      {!isEditing && (
        <>
          <div>
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Wireless Headphones"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a detailed description"
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="100"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price e.g., 129.99"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Image URLs</Label>
            <Input
              id="image"     
              name="images"
              value={formData.images[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </>
      )}

      <div>
        <Label>Variants</Label>
        <div className="mt-2 space-y-4">
          {formData.variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="p-4 border rounded">
              <div>
                <Label htmlFor={`color-${variantIndex}`}>Color</Label>
                <Input
                  id={`color-${variantIndex}`}
                  value={variant.color}
                  onChange={(e) => handleVariantChange(variantIndex, 'color', e.target.value)}
                  placeholder="e.g., Black"
                  required
                />
              </div>
              {Array.isArray(variant.stock) && variant.stock.map((stock, stockIndex) => (
                <div key={stockIndex} className="flex items-center mt-2">
                  <div className="flex-1 mr-2">
                    <Label htmlFor={`size-${variantIndex}-${stockIndex}`}>Size</Label>
                    <Select
                      id={`size-${variantIndex}-${stockIndex}`}
                      value={stock.size}
                      onChange={(e) => handleStockChange(variantIndex, stockIndex, 'size', e.target.value)}
                      required
                    >
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1 mr-2">
                    <Label htmlFor={`quantity-${variantIndex}-${stockIndex}`}>Quantity</Label>
                    <Input
                      id={`quantity-${variantIndex}-${stockIndex}`}
                      type="number"
                      value={stock.quantity}
                      onChange={(e) => handleStockChange(variantIndex, stockIndex, 'quantity', e.target.value)}
                      placeholder="e.g., 10"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeStock(variantIndex, stockIndex)}
                    className="mt-6"
                  >
                    <XCircle size={16} className="text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addStock(variantIndex)}
                className="mt-2"
              >
                <Plus size={16} className="text-green-500 mr-2" />
                Add Size
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeVariant(variantIndex)}
                className="mt-2 ml-2"
              >
                <XCircle size={16} className="text-red-500 mr-2" />
                Remove Variant
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addVariant}
            className="flex items-center justify-center w-full"
          >
            <Plus size={16} className="text-green-500 mr-2" />
            Add Variant
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className={isEditing ? "bg-yellow-500 hover:bg-yellow-600" : ""}>
          {isEditing ? "Update" : "Save Product"}
        </Button>
      </div>

      <ToastContainer />
    </form>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Error fetching products!');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
  };
  const handleSave = async (updatedProduct) => {
    if (updatedProduct._id) {
      try {
        await api.put(`/products/${updatedProduct._id}`, updatedProduct);
        toast.success('Product updated successfully!');
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error('Error updating product!');
      }
    } else {
      try {
        await api.post('/products', updatedProduct);
        toast.success('Product added successfully!');
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error('Error adding product!');
      }
    }
    fetchProducts();
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct || !deletingProduct._id) {
      toast.error('Invalid product to delete');
      return;
    }
    try {
      await api.delete(`/products/${deletingProduct._id}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Error deleting product!');
    }
    setDeletingProduct(null);
  };

  const handleToggleActive = async (id) => {
    if (!id) {
        toast.error('Invalid product ID');
        return;
    }
    
    const product = products.find(p => p._id === id);
    if (!product) {
        toast.error('Product not found');
        return;
    }
    
    console.log('Toggling product:', {
        id,
        currentActiveState: product.active,
        newActiveState: !product.active
    });
    
    try {
        const response = await api.put(`/products/${id}`, {
            active: product.active ? false : true
        });
        
        console.log('Toggle response:', response.data);
        
        if (response.data.product) {
            setProducts(products.map(p => 
                p._id === id ? response.data.product : p
            ));
            toast.success(`Product ${response.data.product.active ? 'activated' : 'deactivated'} successfully`);
        }
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || 'Error updating product status';
        toast.error(errorMessage);
    }
};

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => setIsAddingProduct(true)}>
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="space-y-4">
        {products.map(product => (
          <ProductItem
            key={product._id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>

      <Dialog open={editingProduct !== null || isAddingProduct} onOpenChange={() => {
        setEditingProduct(null);
        setIsAddingProduct(false);
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product Variants' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setEditingProduct(null);
              setIsAddingProduct(false);
            }}
            isEditing={!!editingProduct}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deletingProduct !== null} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingProduct?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;