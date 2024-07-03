import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const token = useSelector(state => state.data.token)

    useEffect(() => {
        const getOrders = async () => {
          setIsLoading(true);
            await axios.get('http://localhost:3001/api/orders', {
              headers: `Bearer ${token}`
            })
             .then(res => {
                setIsLoading(false);
                setOrders(res.data);
              })
           .catch(err => {
              setIsLoading(false);
              alert(err.message);
              console.log(err);
            });
        };
        getOrders();
      }, []);

      console.log(orders)

  return (
    <div>
      <h1>Orders</h1>
      {isLoading && <div>Loading...</div>}
      {!isLoading && orders.length === 0 && <div>No orders found</div>}
      {!isLoading && orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>VIJJ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Orders