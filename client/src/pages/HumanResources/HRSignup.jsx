import { SignUP } from "../../components/common/sign-up"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import LoadingBar from 'react-top-loading-bar'
import { useNavigate } from 'react-router-dom'
import { CommonStateHandler } from "../../utils/commonhandler.js"
import { HandlePostHumanResources, HandleGetHumanResources } from "../../redux/Thunks/HRThunk.js"

export const HRSignupPage = () => {
    const HRState = useSelector((state) => state.HRReducer)
    const [errorpopup, seterrorpopup] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loadingbar = useRef(null)
    const [signupform, set_signuform] = useState({
        firstname: "",
        lastname: "",
        email: "",
        contactnumber: "",
        password: "",
        textpassword: "",
        name : "", 
        description : "", 
        OrganizationURL : "", 
        OrganizationMail : ""
    })

    const handlesignupform = (event) => {
        CommonStateHandler(event.target.name, event.target.value, set_signuform)
    }

    const handlesubmitform = (event) => {
        event.preventDefault();
        if (signupform.textpassword === signupform.password) {
            seterrorpopup(false)
            loadingbar.current?.continuousStart();
            dispatch(HandlePostHumanResources({ apiroute: "SIGNUP", data: signupform }))
        }
        else {
            seterrorpopup(true)
        }
    }


    useEffect(() => {
        if (HRState.error.status) {
            loadingbar.current?.complete()
        }
    }, [HRState.error.status])

    useEffect(() => {
        if (HRState.isAuthenticated && HRState.isVerified) {
            loadingbar.current?.complete()
            navigate("/auth/HR/dashboard/dashboard-data")
        }

        if (HRState.isAuthenticated && !HRState.isVerified) {
            loadingbar.current?.complete()
            navigate("/auth/HR/verify-email")
        }
    }, [HRState.isAuthenticated, HRState.isVerified])

    return (
        <div className="HRsignup-page-container h-screen flex justify-center min-[900px]:justify-center min-[900px]:items-center">
            <LoadingBar ref={loadingbar} />
            <SignUP stateformdata={signupform} handlesignupform={handlesignupform} handlesubmitform={handlesubmitform} errorpopup={errorpopup} />
        </div>
    )
}