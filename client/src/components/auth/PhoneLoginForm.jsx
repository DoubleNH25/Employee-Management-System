import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Smartphone, ArrowLeft } from "lucide-react"

export const PhoneLoginForm = ({ onSubmitPhone, onSubmitOTP, onBack, error, isLoading }) => {
    const [step, setStep] = useState("phone")
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handlePhoneSubmit = async (e) => {
        e.preventDefault()
        const success = await onSubmitPhone(phone)
        if (success) {
            setStep("otp")
            setCountdown(300)
        }
    }

    const handleOTPSubmit = async (e) => {
        e.preventDefault()
        await onSubmitOTP(phone, otp)
    }

    const handleResendOTP = async () => {
        if (countdown > 0) return
        const success = await onSubmitPhone(phone)
        if (success) {
            setCountdown(300)
            setOtp("")
        }
    }

    const formatCountdown = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (step === "phone") {
        return (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Phone Number
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+84912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">
                        Enter phone number in international format (e.g., +84 for Vietnam)
                    </p>
                </div>
                
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
                
                <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send OTP"}
                </Button>
                
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={onBack}
                    disabled={isLoading}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Email Login
                </Button>
            </form>
        )
    }

    return (
        <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label className="text-center block">
                    Enter OTP sent to {phone}
                </Label>
                <div className="flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                {countdown > 0 && (
                    <p className="text-sm text-center text-gray-500">
                        Code expires in {formatCountdown(countdown)}
                    </p>
                )}
            </div>
            
            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            
            <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || otp.length !== 6}
            >
                {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>
            
            <div className="text-center space-y-2">
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isLoading}
                    className={`text-sm ${
                        countdown > 0 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-purple-600 hover:text-purple-700"
                    }`}
                >
                    {countdown > 0 ? `Resend OTP in ${formatCountdown(countdown)}` : "Resend OTP"}
                </button>
                
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                        setStep("phone")
                        setOtp("")
                        setCountdown(0)
                    }}
                    disabled={isLoading}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Phone Number
                </Button>
            </div>
        </form>
    )
}
