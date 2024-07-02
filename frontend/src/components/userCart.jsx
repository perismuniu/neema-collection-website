import {useSelector} from "react-redux"

const UserCart = () => {

    const userCart = useSelector(state => state.data.userCart)

    if (!userCart) {
        return <div>
            <h1>No Items in Cart</h1>
        </div>        
    }

  return (
    <div>
      <h1 className="font-semibold text-3xl border-b-2 pb-5 pt-2 items-center ">User Shopping Cart</h1>
        <div>
            {userCart.map((item) => (
                <div key={item._id}>
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default UserCart