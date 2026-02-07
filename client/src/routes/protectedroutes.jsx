import { Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { HandleGetEmployees } from "../redux/Thunks/EmployeeThunk"
import { Loading } from "../components/common/loading"

export const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.employeereducer)
    const dispatch = useDispatch()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await dispatch(HandleGetEmployees({ apiroute: "CHECKELOGIN" })).unwrap()
            } catch (error) {
            } finally {
                setIsChecking(false)
            }
        }
        
        checkAuth()
    }, [dispatch])
    
    if (isChecking || isLoading) {
        return <Loading />
    }

    return isAuthenticated ? children : <Navigate to="/auth/employee/login" replace />
}