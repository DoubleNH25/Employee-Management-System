import { HandleGetHumanResources } from "../redux/Thunks/HRThunk.js"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Loading } from "../components/common/loading.jsx"

export const HRProtectedRoutes = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const HRState = useSelector((state) => state.HRReducer)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            if (!HRState.isAuthenticated && !HRState.isAuthourized && !HRState.isVerified && !HRState.error.content) {
                try {
                    await dispatch(HandleGetHumanResources({ apiroute: "CHECKLOGIN" })).unwrap()
                    await dispatch(HandleGetHumanResources({ apiroute: "CHECK_VERIFY_EMAIL" })).unwrap()
                } catch (error) {
                } finally {
                    setIsChecking(false)
                }
            } else {
                setIsChecking(false)
            }
        }

        checkAuth()
    }, [])

    useEffect(() => {
        if (HRState.isAuthenticated && HRState.isAuthourized && !HRState.isVerified && HRState.error.content) {
            navigate("/auth/HR/reset-email-validation")
        }

        if (!HRState.isAuthenticated && !HRState.isAuthourized && !HRState.isVerified && HRState.error.content) {
            navigate("/auth/HR/signup")
        }
    }, [HRState.isAuthenticated, HRState.isAuthourized, HRState.isVerified, HRState.error.content])

    if (isChecking || HRState.isLoading) {
        return <Loading />
    }

    if (HRState.isAuthenticated && HRState.isAuthourized && HRState.isVerified) {
        return children
    }

    return <Navigate to="/auth/HR/login" replace />
}