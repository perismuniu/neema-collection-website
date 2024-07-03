import { useSelector } from "react-redux"

const IsAdmin = (adminComponent) => {
    const isAdmin = useSelector(state => state.auth.user)
}