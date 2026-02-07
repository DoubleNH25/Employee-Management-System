import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HandleUpdateEmployeeProfile, HandleGetEmployeeProfile } from "../../redux/Thunks/EmployeeDashboardThunk";
import { useToast } from "../../hooks/use-toast";

export const EmployeeProfile = ({ profile }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        phone: profile.phone || profile.contactnumber || ""
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setFormData({
            firstname: profile.firstname || "",
            lastname: profile.lastname || "",
            phone: profile.phone || profile.contactnumber || ""
        });
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const result = await dispatch(HandleUpdateEmployeeProfile(formData));
            if (result.type === 'HandleUpdateEmployeeProfile/fulfilled') {
                toast({
                    title: "Success",
                    description: "Profile updated successfully",
                    variant: "default"
                });
                setIsEditing(false);
                dispatch(HandleGetEmployeeProfile());
            } else {
                toast({
                    title: "Error",
                    description: result.payload || "Failed to update profile",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstname: profile.firstname || "",
            lastname: profile.lastname || "",
            phone: profile.phone || profile.contactnumber || ""
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role/Position (Read-only)
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={profile.role || ""}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email (Read-only)
                        </label>
                        <input
                            type="email"
                            value={profile.email || ""}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-400"
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isUpdating}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                First Name
                            </label>
                            <p className="text-lg text-gray-900">{profile.firstname}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Last Name
                            </label>
                            <p className="text-lg text-gray-900">{profile.lastname}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email
                        </label>
                        <p className="text-lg text-gray-900">{profile.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <p className="text-lg text-gray-900">{profile.phone || profile.contactnumber || "Not provided"}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Role/Position
                        </label>
                        <p className="text-lg text-gray-900">{profile.role}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Department
                        </label>
                        <p className="text-lg text-gray-900">{profile.departmentName || profile.departmentId || "Not assigned"}</p>
                    </div>

                    {profile.schedule && (
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Work Schedule
                            </label>
                            <p className="text-lg text-gray-900">
                                {profile.schedule.days?.join(', ') || 'N/A'} | {profile.schedule.startTime || 'N/A'} - {profile.schedule.endTime || 'N/A'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
