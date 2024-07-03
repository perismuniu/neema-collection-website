import { useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import { getUserCart, removeFromCart } from "../redux/userActionSlice"

const UserCart = () => {

    const userCart = useSelector(state => state.data.userCart)
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

    useEffect(() => {
        getUserCart(dispatch, token)
    }, [token, dispatch])

    if (!userCart) {
        return <div>
            <h1>No Items in Cart</h1>
        </div>        
    }
    const handleProceedToCheckout = () => {

    }
    const handleRemoveItem = (id) => {
        removeFromCart(dispatch, token, id)
    }

    console.log(userCart)

    return (
        <div className="max-w-md mx-auto p-4 pt-6 md:p-6 lg:p-12">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          <ul className="divide-y divide-gray-200">
            {userCart.items.map((item) => (
              <li key={item._id} className="py-4 flex">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.product?.title}</h3>
                  <p className="text-gray-600">{item.product?.description}</p>
                  <p className="text-gray-600">
                    Quantity: {item.buyingQuantity} x ${item.product?.price}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <p className="text-lg font-bold">Total: ${userCart.buyingTotalPrice}</p>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      );
}

export default UserCart