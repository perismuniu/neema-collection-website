import Footer from "./Footer"
import ProductItem from './products/productitem';
import ProductCard from './products/productcard';
import {useDispatch, useSelector} from "react-redux"
import { useEffect } from "react";
import { getProducts, getUserCart } from "../redux/userActionSlice";


const Homepage = () => {
  const products = useSelector(state => state.data.products)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user);
  const token = useSelector(state => state.auth.token)

  console.log(products)
  console.log("next is useEffect")
  
  // dispatch(getProducts(dispatch))
  useEffect(() => {
    getProducts(dispatch).then(()=> {
      user ? getUserCart(dispatch, token) : null
    })
  }
  ,[]);
  
  return (
    <div className="bg-off-white min-h-screen  px-6 lg:px-48 bg-cover">
      <div className="container mx-auto">
        {products && products.length > 0 && (
          <ProductCard 
          key={products[0].id}
          image={products[0].image}
          title={products[0].title}
          description={products[0].description}
          buttonText="SHOP NOW"

        />
        )}

<div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 bg-pink-50">
      {products.map((pro, index) => (
        <ProductItem
              key={index}
              image={pro.image}
              name={pro.title}
              id={pro._id}
              price={pro.price}
              buttonText="SHOP NOW"
            />
      ))}
    </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;