import { useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import { getUserCart } from "../redux/userActionSlice"

const UserCart = () => {

    const userCart = useSelector(state => state.data.userCart)
    const userCartProducts = useSelector(state => state.data.userCartProducts)
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

    return (
    <div>
      <h1 className="font-semibold text-3xl border-b-2 pb-5 pt-2 items-center ">User Shopping Cart</h1>
        <div>
            {userCartProducts.map((item) => (
                <div key={item._id} className="flex justify-center flex-col items-center">
                    <img src={item.image} alt={item.title} className="h-[50%] w-[50%] " />
                    <div className="pl-2 text-left">
                    <p className="text-start">{item.title}</p>
                    <p>{item.price}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default UserCart