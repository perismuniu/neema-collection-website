import { useEffect, useState } from "react";
import axios from "axios"
const ProductList = () => {

  const [products, setProducts] = useState([])

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)
      const res = await axios.get("http://localhost:3001/api/products")
      setProducts(res.data)
      setLoading(false)
      } catch (error) {
        setError(error)
      }
    }
    getProducts()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }
  if(error){
    return <div>{error.message}</div>
  }
  if (!products) {
    return <div>No products available</div>;
  }

  return (
    <div className="mt-4">
      {
        products.map((product) => (
          <div
            key={product._id}
            className="flex justify-between mx-8"
          >
            <p>{product.title}</p>
            <p>{product.stock}</p>
             </div>
        ))
      }
    </div>
  );
};

export default ProductList;