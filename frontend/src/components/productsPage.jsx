import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { addToCart, getProductById } from "../redux/userActionSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductsPage = () => {
  const [product, setProduct] = useState({});
  const location = useLocation().pathname;
  const [buyingQuantity, setBuyingQuantity] = useState(0)
  const id = location.split(":")[1];
  const [color, setColor] = useState("blue");
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    getProductById(id).then((data) => setProduct(data));
  }, [id]);

  const handleAddToCart = async () => {
    addToCart(dispatch, token, id, buyingQuantity)
  }
  if(buyingQuantity < 0) setBuyingQuantity(0)

  return (
    <div className="flex items-center flex-col lg:flex-row justify-center lg:px-10">
      <div className="w-[60%] ">
        <img src={product.image} />
      </div>
      <div className="flex-[30%]">
        <h1 className="font-semibold text-2xl">{product.title}</h1>
        <div className="flex mb-2">
          <p className="text-green-600 px-2 py-1 border-green-600 border-2 rounded-md text-center">
            KHs {product.price}
          </p>
          <p>{product.rating}</p>
        </div>
        <p>Color: {color}</p>
        <div className="flex gap-x-1">
          {product.colors?.map((color, index) => (
            <p key={index} onClick={() => setColor(color.color)}>
              {color.color}
            </p>
          ))}
        </div>
        <p>{product.category}</p>
        <p>{product.size}</p>
        <div className="flex gap-x-3">
            <div className="items-center rounded-3xl flex flex-col text-black font-Outfit font-semibold justify-center bg-gray bg-opacity-20 text-center px-8 py-2">
                <div className="bg-opacity-20 px-2 flex justify-between"><span className="bg-opacity-20 cursor-pointer mr-8" onClick={() => setBuyingQuantity(buyingQuantity - 1)}>-</span> {buyingQuantity} <span className="bg-opacity-20 ml-8 cursor-pointer" onClick={() => setBuyingQuantity(buyingQuantity + 1)}>+</span></div>
            </div>
            <button className="bg-gray text-white font-semibold text-center px-16 py-2 font-Outfit rounded-3xl text-2xl"  onClick={() => handleAddToCart()}>Add to cart</button >
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
