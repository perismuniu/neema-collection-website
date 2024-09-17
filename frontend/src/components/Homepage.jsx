import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getUserCart } from "../redux/userActionSlice";
import ProductCard from './products/productcard';
import ProductItem from './products/productitem';
import Footer from "./Footer";

const Homepage = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.data.products);
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      await getProducts(dispatch)
      if (user) {
        await getUserCart(dispatch, token)
      }
    };
    fetchData();
  }, [dispatch, user, token]);

  return (
    <div className="bg-off-white min-h-screen px-6 lg:px-48 bg-cover">
      <div className="container mx-auto">
        {products && products.length > 0 && (
          <ProductCard 
            key={products[0]._id}
            image={products[0].image}
            title={products[0].title}
            description={products[0].description}
            buttonText="SHOP NOW"
          />
        )}

        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 bg-pink-50">
          {products.map((product) => (
            <ProductItem
              key={product._id}
              image={product.image}
              name={product.title}
              id={product._id}
              price={product.price}
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
