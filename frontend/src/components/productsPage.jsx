import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProductDetail = () => {

  const products = useSelector(state => state.data.products)
  const location = useLocation().pathname
  const proId = location.slice( )

  return (
    <div className="flex flex-col md:flex-row bg-white p-4">
      <div className="md:w-1/2">
        <div className="relative">
          <img 
            src={products}
            alt="Big Italian Sofa" 
            className="w-full"
          />
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
            &lt;
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md">
            &gt;
          </button>
        </div>
        <div className="flex space-x-2 mt-2">
          <img src="https://res.cloudinary.com/dhoopmcrq/image/upload/v1719953314/nerc07yzj9g5hwgvotvf.png" alt="Thumbnail" className="w-16 h-16 border border-gray-300" />
          <img src="https://res.cloudinary.com/dhoopmcrq/image/upload/v1719953314/nerc07yzj9g5hwgvotvf.png" alt="Thumbnail" className="w-16 h-16 border border-gray-300" />
          <img src="https://res.cloudinary.com/dhoopmcrq/image/upload/v1719953314/nerc07yzj9g5hwgvotvf.png" alt="Thumbnail" className="w-16 h-16 border border-gray-300" />
          <img src="https://res.cloudinary.com/dhoopmcrq/image/upload/v1719953314/nerc07yzj9g5hwgvotvf.png" alt="Thumbnail" className="w-16 h-16 border border-gray-300" />
        </div>
      </div>
      <div className="md:w-1/2 p-4">
        <h1 className="text-2xl font-bold">BIG ITALIAN SOFA</h1>
        <div className="flex items-center mt-2">
          <div className="text-yellow-400 flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current">
                <use href="#star" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-500">(150)</span>
        </div>
        <p className="text-green-500 mt-2">Availability: In Stock</p>
        <p className="mt-1"><span className="font-semibold">Brand:</span> apex</p>
        <p className="mt-1"><span className="font-semibold">Category:</span> Sofa</p>
        <p className="mt-1"><span className="font-semibold">SKU:</span> BE45VGTRK</p>
        <p className="text-3xl font-bold text-purple-600 mt-4">$450 <span className="text-gray-500 line-through">$999</span></p>
        <p className="text-gray-600 mt-4">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem exercitationem voluptate sint eius ea assumenda provident eos repellendus qui neque!</p>
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Size</h2>
          <div className="flex space-x-2">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button key={size} className="border rounded-lg px-4 py-2">{size}</button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Color</h2>
          <div className="flex space-x-2">
            {['black', 'blue', 'red', 'gray'].map((color) => (
              <button key={color} className={`w-6 h-6 rounded-full border border-gray-300 bg-${color}-500`}></button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <h2 className="font-semibold mr-2">Quantity</h2>
          <button className="border rounded-l-lg px-4 py-2">-</button>
          <span className="border-t border-b px-4 py-2">1</span>
          <button className="border rounded-r-lg px-4 py-2">+</button>
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg">Add to cart</button>
          <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg">Wishlist</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
