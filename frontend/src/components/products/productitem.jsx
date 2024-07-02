import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductItem = ({ id }) => {
  const products = useSelector((state) => state.data.products);
  const navigate = useNavigate()

  return (
    <div onClick={()=> navigate(`/products/:${id}`)} className="cursor-pointer">
      {products &&
        products.map((pro, index) => (
          <div key={index}>
            <div className="relative">
              <img src={pro.image} alt="product" />
              <i
                className="pi pi-heart absolute top-2 right-2 bg-blue-700 p-2 rounded-full"
                style={{ fontSize: "1rem" }}
              ></i>
              <div className="flex gap-x-1">
                {pro.sizes?.map((size, index) => {
                  return (
                    <p key={index} className="">
                      {size}
                    </p>
                  );
                })}
              </div>
            </div>
            <p>{pro.colors}</p>
            <p>{pro.title}</p>
            <div className="flex justify-between">
              <p className=" border-green-600 text-green-600 px-2 py-1 border-2 rounded-md mt-2">
                Khs {pro.price}
              </p>
              <p> {pro.reviews}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductItem;
