import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/userActionSlice';

function ProductList() {
  const products = useSelector(state => state.data.products)

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch()

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
  };

  const handleUpdate = () => {
    // Update product in the array
    setIsEditing(false);
  };

  const handleRemove = (code) => {
    // Remove product from the array
    dispatch(setProducts(products.filter((product) => product.code !== code)))
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-auto h-[90%]">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Stock</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Colors</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="bg-white hover:bg-gray-100 text-gray-800 text-sm leading-normal">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {product.title}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {product.stock}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {product.category}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {product.color}
              </td>
              <td className="py-3 px-6 text-center whitespace-nowrap">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(product.code)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            {/* Form to update product details */}
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;