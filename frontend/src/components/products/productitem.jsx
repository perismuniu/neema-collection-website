import { useNavigate } from "react-router-dom";

const ProductItem = ({ id, image, name, price, sizes, colors, reviews }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md" >
          <img src={image} alt="Product" className="w-full h-[50%] mb-4 rounded-lg" />
          <h3 className="text-lg font-semibold text-center">{name}</h3>
          <p className="text-center">Price: KSh {price}</p>
          <button className="px-4 py-2 mt-4 text-white bg-light-pink rounded-full font-bold" onClick={() => navigate(`/products/:${id}`)}>SHOP NOW</button>
        </div>
    )
};

export default ProductItem;
