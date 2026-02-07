import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetMyProfile, HandleUpdateMyProfile } from "../../../redux/Thunks/HRThunk"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Building2, Edit2, Save, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const ProfilePage = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { profile, isProfileLoading } = useSelector((state) => state.HRReducer)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        contactnumber: ""
    })
    const [hasLoadedProfile, setHasLoadedProfile] = useState(false)

    useEffect(() => {
        const loadProfile = async () => {
            if (!hasLoadedProfile) {
                try {
                    const result = await dispatch(HandleGetMyProfile())
                    setHasLoadedProfile(true)
                } catch (error) {
                    setHasLoadedProfile(true)
                }
            }
        }
        loadProfile()
    }, [dispatch, hasLoadedProfile])

    useEffect(() => {
        if (profile) {
            setFormData({
                firstname: profile.firstname || "",
                lastname: profile.lastname || "",
                email: profile.email || "",
                contactnumber: profile.contactnumber || ""
            })
        }
    }, [profile])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const result = await dispatch(HandleUpdateMyProfile(formData))
            
            if (result.type === 'HandleUpdateMyProfile/fulfilled') {
                toast({
                    title: "Thành công",
                    description: "Cập nhật thông tin cá nhân thành công",
                    variant: "default"
                })
                setIsEditing(false)
            } else {
                toast({
                    title: "Lỗi",
                    description: result.payload?.message || "Không thể cập nhật thông tin",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đã xảy ra lỗi khi cập nhật thông tin",
                variant: "destructive"
            })
        }
    }

    const handleCancel = () => {
        if (profile) {
            setFormData({
                firstname: profile.firstname || "",
                lastname: profile.lastname || "",
                email: profile.email || "",
                contactnumber: profile.contactnumber || ""
            })
        }
        setIsEditing(false)
    }

    if (isProfileLoading && !profile) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h1>
                    <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản của bạn</p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl text-purple-700">Hồ sơ HR</CardTitle>
                                <CardDescription className="text-gray-600 mt-1">
                                    Xem và chỉnh sửa thông tin cá nhân của bạn
                                </CardDescription>
                            </div>
                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname" className="flex items-center gap-2 text-gray-700">
                                            <User className="w-4 h-4 text-purple-600" />
                                            Họ
                                        </Label>
                                        <Input
                                            id="firstname"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={!isEditing ? "bg-gray-50" : ""}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastname" className="flex items-center gap-2 text-gray-700">
                                            <User className="w-4 h-4 text-purple-600" />
                                            Tên
                                        </Label>
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={!isEditing ? "bg-gray-50" : ""}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                                        <Mail className="w-4 h-4 text-purple-600" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactnumber" className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-purple-600" />
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        id="contactnumber"
                                        name="contactnumber"
                                        value={formData.contactnumber}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        <Building2 className="w-4 h-4 text-purple-600" />
                                        Phòng ban
                                    </Label>
                                    <Input
                                        value={profile?.department?.name || "Chưa có phòng ban"}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        Vai trò
                                    </Label>
                                    <Input
                                        value={profile?.role || ""}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            type="submit"
                                            disabled={isProfileLoading}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            {isProfileLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Lưu thay đổi
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={isProfileLoading}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
