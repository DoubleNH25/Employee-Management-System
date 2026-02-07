import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandlePostEmployees } from "../../redux/Thunks/EmployeeThunk.js"
import LoadingBar from 'react-top-loading-bar'
import { useNavigate } from 'react-router-dom'
import { clearEmployeeError } from "../../redux/Slices/EmployeeSlice.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "../../hooks/use-toast.js"
import { ArrowLeft } from "lucide-react"

export const EmployeeLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loadingbar = useRef(null)
    const { toast } = useToast()
    const EmployeeState = useSelector((state) => state.employeereducer)
    
    const [loginMethod, setLoginMethod] = useState("password")
    const [passwordForm, setPasswordForm] = useState({
        email: "",
        password: "",
    })
    const [otpForm, setOtpForm] = useState({
        email: "",
        otp: "",
    })
    const [otpSent, setOtpSent] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)

    useEffect(() => {
        dispatch(clearEmployeeError())
    }, [])

    const handlePasswordFormChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    const handleOtpFormChange = (e) => {
        setOtpForm({ ...otpForm, [e.target.name]: e.target.value })
    }

    const handlePasswordLogin = async (e) => {
        e.preventDefault()
        loadingbar.current?.continuousStart()
        dispatch(HandlePostEmployees({ apiroute: "LOGIN", data: passwordForm }))
    }

    const handleRequestOTP = async (e) => {
        e.preventDefault()
        if (!otpForm.email) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter your email address",
            })
            return
        }

        setOtpLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_EMPLOYEE_API}/api/auth/employee/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpForm.email }),
            })

            const data = await response.json()

            if (data.success) {
                setOtpSent(true)
                toast({
                    title: "OTP Sent",
                    description: "Check your email for the OTP code",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to send OTP",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send OTP. Please try again.",
            })
        } finally {
            setOtpLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        if (!otpForm.otp) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter the OTP code",
            })
            return
        }

        loadingbar.current?.continuousStart()
        try {
            const response = await fetch(`${import.meta.env.VITE_EMPLOYEE_API}/api/auth/employee/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: otpForm.email, otp: otpForm.otp }),
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Login successful!",
                })
                navigate("/auth/employee/employee-dashboard")
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Invalid OTP",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to verify OTP. Please try again.",
            })
        } finally {
            loadingbar.current?.complete()
        }
    }

    useEffect(() => {
        if (EmployeeState.error.status) {
            loadingbar.current?.complete()
        }
    }, [EmployeeState.error.status])

    useEffect(() => {
        if (EmployeeState.isAuthenticated) {
            loadingbar.current?.complete()
            navigate("/auth/employee/employee-dashboard")
        }
    }, [EmployeeState.isAuthenticated])

    return (
        <div className="employee-login-container min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <LoadingBar ref={loadingbar} color="#667eea" />
            
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
                    <CardTitle className="text-2xl font-bold text-center">Employee Login</CardTitle>
                    <CardDescription className="text-center">
                        Choose your preferred login method
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={loginMethod} onValueChange={setLoginMethod} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="otp">Email OTP</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <form onSubmit={handlePasswordLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@company.com"
                                        value={passwordForm.email}
                                        onChange={handlePasswordFormChange}
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
                                        value={passwordForm.password}
                                        onChange={handlePasswordFormChange}
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                                {EmployeeState.error.status && (
                                    <p className="text-sm text-red-500">{EmployeeState.error.message}</p>
                                )}
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                    Login with Password
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="otp">
                            {!otpSent ? (
                                <form onSubmit={handleRequestOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp-email">Email</Label>
                                        <Input
                                            id="otp-email"
                                            name="email"
                                            type="email"
                                            placeholder="your.email@company.com"
                                            value={otpForm.email}
                                            onChange={handleOtpFormChange}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                                        disabled={otpLoading}
                                    >
                                        {otpLoading ? "Sending..." : "Send OTP"}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp-code">OTP Code</Label>
                                        <Input
                                            id="otp-code"
                                            name="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={otpForm.otp}
                                            onChange={handleOtpFormChange}
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            Check your email for the OTP code
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setOtpSent(false)}
                                        >
                                            Back
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Verify & Login
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
