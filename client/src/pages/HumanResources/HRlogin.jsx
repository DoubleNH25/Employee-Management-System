import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import LoadingBar from 'react-top-loading-bar'
import { HandlePostHumanResources, HandleGetHumanResources } from "../../redux/Thunks/HRThunk.js"
import { clearHRError } from "../../redux/Slices/HRSlice.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Smartphone } from "lucide-react"
import { PhoneLoginForm } from "@/components/auth/PhoneLoginForm"
import { apiService } from "../../redux/apis/apiService"
import { HREndPoints } from "../../redux/apis/APIsEndpoints"

export const HRLogin = () => {
    const HRState = useSelector((state) => state.HRReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loadingbar = useRef(null)
    const [activeTab, setActiveTab] = useState("email")
    const [signinform, setsigninform] = useState({
        email: "",
        password: ""
    })
    const [phoneError, setPhoneError] = useState("")
    const [phoneLoading, setPhoneLoading] = useState(false)

    useEffect(() => {
        dispatch(clearHRError())
    }, [])

    const handlesigninform = (e) => {
        setsigninform({ ...signinform, [e.target.name]: e.target.value })
    }

    const handlesigninsubmit = (e) => {
        e.preventDefault()
        loadingbar.current?.continuousStart()
        dispatch(HandlePostHumanResources({ apiroute: "LOGIN", data: signinform }))
    }

    const handleSendOTP = async (phone) => {
        setPhoneError("")
        setPhoneLoading(true)
        loadingbar.current?.continuousStart()
        
        try {
            const response = await apiService.post(HREndPoints.SEND_OTP, { phone }, {
                withCredentials: true
            })
            
            loadingbar.current?.complete()
            setPhoneLoading(false)
            
            if (response.data.success) {
                return true
            } else {
                setPhoneError(response.data.message)
                return false
            }
        } catch (error) {
            loadingbar.current?.complete()
            setPhoneLoading(false)
            setPhoneError(error.response?.data?.message || "Failed to send OTP")
            return false
        }
    }

    const handleVerifyOTP = async (phone, otpCode) => {
        setPhoneError("")
        setPhoneLoading(true)
        loadingbar.current?.continuousStart()
                
        try {
            const response = await apiService.post(HREndPoints.VERIFY_OTP, { phone, otpCode }, {
                withCredentials: true
            })
                        
            if (response.data.success) {
                
                // Update Redux state by calling CHECKLOGIN
                await dispatch(HandleGetHumanResources({ apiroute: "CHECKLOGIN" })).unwrap()
                
                loadingbar.current?.complete()
                setPhoneLoading(false)
                
                // Navigate to dashboard - protected route will now allow access
                navigate("/auth/HR/dashboard", { replace: true })
            } else {
                loadingbar.current?.complete()
                setPhoneLoading(false)
                setPhoneError(response.data.message)
            }
        } catch (error) {
            loadingbar.current?.complete()
            setPhoneLoading(false)
            setPhoneError(error.response?.data?.message || "Failed to verify OTP")
        }
    }

    useEffect(() => {
        if (HRState.error.status) {
            loadingbar.current?.complete()
        }
    }, [HRState.error.status])

    useEffect(() => {
        if (HRState.isAuthenticated) {
            loadingbar.current?.complete()
            navigate("/auth/HR/dashboard")
        }
    }, [HRState.isAuthenticated])

    return (
        <div className="hr-login-container min-h-screen flex items-center justify-center bg-purple-50 p-4">
            <LoadingBar ref={loadingbar} color="#9333ea" />
            
            <Card className="w-full max-w-md shadow-xl relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 z-10"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <CardHeader className="space-y-1 pt-12">
                    <CardTitle className="text-2xl font-bold text-center">HR Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to manage your organization
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </TabsTrigger>
                            <TabsTrigger value="phone" className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                Phone
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="email">
                            <form onSubmit={handlesigninsubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="hr.admin@company.com"
                                        value={signinform.email}
                                        onChange={handlesigninform}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={signinform.password}
                                        onChange={handlesigninform}
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                                {HRState.error.status && (
                                    <p className="text-sm text-red-500">{HRState.error.message}</p>
                                )}
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                                    Login
                                </Button>
                            </form>
                        </TabsContent>
                        
                        <TabsContent value="phone">
                            <PhoneLoginForm
                                onSubmitPhone={handleSendOTP}
                                onSubmitOTP={handleVerifyOTP}
                                onBack={() => setActiveTab("email")}
                                error={phoneError}
                                isLoading={phoneLoading}
                            />
                        </TabsContent>
                    </Tabs>
                    
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/auth/HR/signup")}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Sign up
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
