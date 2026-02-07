import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { Users, UserCog, ArrowRight, Building2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export const EntryPage = () => {
    const navigate = useNavigate()
    const [showLoginDialog, setShowLoginDialog] = useState(false)

    return (
        <div className="entry-page-container min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="min-h-screen flex flex-col">
                {/* Navigation */}
                <nav className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EMS
                        </span>
                    </div>
                    <Button 
                        onClick={() => setShowLoginDialog(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8"
                    >
                        Login
                    </Button>
                </nav>

                {/* Hero Content */}
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Employee
                                    </span>
                                    <br />
                                    <span className="text-gray-800">
                                        Management
                                    </span>
                                    <br />
                                    <span className="text-gray-800">
                                        System
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Streamline your workforce management with our comprehensive platform. 
                                    Manage tasks, track performance, and collaborate seamlessly.
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    <span className="text-gray-700">Real-time task management and tracking</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    <span className="text-gray-700">Instant team communication with chat</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    <span className="text-gray-700">Department and employee analytics</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    <span className="text-gray-700">Secure authentication with OTP support</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div>
                                <Button 
                                    onClick={() => setShowLoginDialog(true)}
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative z-10">
                                <img 
                                    src="../../src/assets/Welcome.png" 
                                    alt="Employee Management" 
                                    className="w-full h-auto drop-shadow-2xl"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="py-12 px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                📊
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Task Management</h3>
                            <p className="text-gray-600">Assign, track, and complete tasks efficiently</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                💬
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Real-time Chat</h3>
                            <p className="text-gray-600">Communicate with your team instantly</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                📈
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Analytics</h3>
                            <p className="text-gray-600">Monitor performance and insights</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Selection Dialog */}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center">Select Your Role</DialogTitle>
                        <DialogDescription className="text-center">
                            Choose how you want to login to the system
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {/* Employee Option */}
                        <Card 
                            className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500 border-2"
                            onClick={() => navigate("/auth/employee/login")}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
                                        <Users className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">Employee</h3>
                                        <p className="text-sm text-gray-600">Access your tasks and dashboard</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* HR Admin Option */}
                        <Card 
                            className="cursor-pointer transition-all hover:shadow-lg hover:border-purple-500 border-2"
                            onClick={() => navigate("/auth/HR/login")}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl">
                                        <UserCog className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">HR Admin</h3>
                                        <p className="text-sm text-gray-600">Manage employees and departments</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    )
}
