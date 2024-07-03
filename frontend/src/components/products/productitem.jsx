import { useNavigate } from "react-router-dom";

const ProductItem = ({ id, image, name, price, sizes, colors, reviews }) => {
  const navigate = useNavigate()

  console.log(id)
  return (
    <div onClick={()=> navigate(`/products/:${id}`)} className="cursor-pointer">
  
            <div className="relative">
              <img src={image} alt="product" />
              <i
                className="pi pi-heart absolute top-2 right-2 bg-blue-700 p-2 rounded-full"
                style={{ fontSize: "1rem" }}
              ></i>
              <div className="flex gap-x-1">
                {/* {sizes.map((size, index) => {
                  return (
                    <p key={index} className="">
                      {size}
                    </p>
                  );
                })} */}
              </div>
            </div>
            <p>{colors}</p>
            <p>{name}</p>
            <div className="flex justify-between">
              <p className=" border-green-600 text-green-600 px-2 py-1 border-2 rounded-md mt-2">
                Khs {price}
              </p>
              <p> {reviews}</p>
            </div>

    </div>)
};

export default ProductItem;
