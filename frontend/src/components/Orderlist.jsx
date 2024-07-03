import { getAdapter } from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import WithAuth from "./utils/WithAuth"

const OrderList = ({ OrderDate, OrderNumber, Price, image, Title, Status }) => {

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const orders = useSelector(state => state.data.orders)
  
  console.log(orders)
  console.log(token)
  useEffect(() => {
    getAdapter(dispatch, token)
  },[])

  return (
    <div className="pt-4  bg-gray-light h-full w-full absolute bg-cover">
      <div className="bg-off-white w-5/6 mx-auto rounded-xl pb-2">
        <div className="flex flex-row justify-around">
          <h1>Order Date:</h1>
          <h2>Order Number:</h2>
          <h1>Price: </h1>
        </div>
        <div className="mt-4 flex flex-row justify-around">
          {/* <img src={} className="h-16 w-16"/> */}
          <div className="ml-4">
            <p> Title:</p>
          </div>
          <p>status:</p>
        </div>
      </div>
    </div>
  )
}

export const NamedOrderList = WithAuth(OrderList)