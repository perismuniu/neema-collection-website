import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, XCircle, Upload } from 'lucide-react';
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  Input, 
  Label, 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch, 
  Textarea 
} from '../products/UIComponents';import { ToastContainer, toast } from 'react-toastify';
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


const ProductForm = ({ product, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(product || {
    title: '',
    description: '',
    price: '',
    variants: [],
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (product && product.images) {
      setSelectedImages(product.images.map(url => ({ url, isExisting: true })));
    }
  }, [product]);

  const handleSizeSelect = (variantIndex, stockIndex, newSize) => {
    handleStockChange(variantIndex, stockIndex, 'size', newSize);
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    if (!selectedImages[index].isExisting) {
      URL.revokeObjectURL(selectedImages[index].preview);
    }
  };

  const uploadImages = async () => {
    const imagesToUpload = selectedImages.filter(img => !img.isExisting);
    if (imagesToUpload.length === 0) return [];

    const formData = new FormData();
    imagesToUpload.forEach(img => {
      formData.append('my_files', img.file);
    });

    try {
      const response = await api.post('/image/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      return response.data.map(result => result.secure_url);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (variantIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleStockChange = (variantIndex, stockIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex
          ? {
              ...variant,
              stock: variant.stock.map((stockItem, j) =>
                j === stockIndex 
                  ? { ...stockItem, [field]: field === 'quantity' ? parseInt(value, 10) : value }
                  : stockItem
              )
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
          ? { ...variant, stock: Array.isArray(variant.stock) ? [...variant.stock, { size: '', quantity: 0 }] : [{ size: 'M', quantity: 0 }] }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setIsProcessing(true);
    
    try {
      // Upload new images
      const uploadedUrls = await uploadImages();
      
      // Combine existing and new image URLs
      const allImageUrls = [
        ...selectedImages.filter(img => img.isExisting).map(img => img.url),
        ...uploadedUrls
      ];

      // Prepare final form data
      const finalFormData = {
        ...formData,
        images: allImageUrls,
      };

      setIsUploading(false);

      // Save product
      let response;
      if (isEditing) {
        response = await api.put(`/products/${product._id}`, finalFormData);
        toast.success('Product updated successfully!');
      } else {
        response = await api.post('/products', finalFormData);
        toast.success('Product added successfully!');
      }
      
      // Clean up object URLs
      selectedImages.forEach(img => {
        if (!img.isExisting) {
          URL.revokeObjectURL(img.preview);
        }
      });
      
      onSave(response.data);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        variants: [],
        images: [],
      });
      setSelectedImages([]);
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || 'Error saving product!');
      
      // If images were uploaded but product save failed, delete the uploaded images
      if (uploadedUrls && uploadedUrls.length > 0) {
        try {
          await api.post('/image/cleanup', { urls: uploadedUrls });
        } catch (cleanupError) {
          console.error("Error cleaning up images:", cleanupError);
        }
      }
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      <fieldset disabled={isProcessing} className="space-y-6">
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
          </>
        )}
  
        <div>
          <Label htmlFor="images">Product Images</Label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-4 mb-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={image.isExisting ? image.url : image.preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    disabled={isProcessing}
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center w-full">
              <label className={`w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'}`}>
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">Select Images</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isProcessing}
                />
              </label>
            </div>
          </div>
        </div>
  
        {isUploading && (
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">Uploading images: {uploadProgress}%</p>
          </div>
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
      {Array.isArray(variant.stock) && variant.stock.map((stockItem, stockIndex) => (
        <div key={stockIndex} className="flex items-center mt-2">
          <div className="flex-1 mr-2">
            <Label htmlFor={`size-${variantIndex}-${stockIndex}`}>Size</Label>
            <Select 
              value={stockItem.size}
              onValueChange={(newSize) => handleSizeSelect(variantIndex, stockIndex, newSize)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 mr-2">
            <Label htmlFor={`quantity-${variantIndex}-${stockIndex}`}>Quantity</Label>
            <Input
              id={`quantity-${variantIndex}-${stockIndex}`}
              type="number"
              value={stockItem.quantity}
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isProcessing}
            className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} ${isEditing ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="
none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isUploading ? 'Uploading...' : 'Saving...'}
              </div>
            ) : isEditing ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </fieldset>
  
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
    
    try {
      const response = await api.put(`/products/${id}`, {
        active: !product.active
      });
      
      if (response.data.product) {
        setProducts(products.map(p => 
          p._id === id ? response.data.product : p
        ));
        toast.success(`Product ${response.data.product.active ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
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