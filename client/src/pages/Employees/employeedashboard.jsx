import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HandleGetEmployeeProfile, HandleGetEmployeeTasks, HandleEmployeeLogout } from "../../redux/Thunks/EmployeeDashboardThunk";
import { resetEmployeeAuth } from "../../redux/Slices/EmployeeSlice";
import { Loading } from "../../components/common/loading";
import { EmployeeTaskList } from "../../components/employee/EmployeeTaskList";
import { EmployeeProfile } from "../../components/employee/EmployeeProfile";
import { EmployeeStats } from "../../components/employee/EmployeeStats";
import { ChatWindow } from "../../components/Chat/ChatWindow";
import { SocketProvider } from "../../context/SocketContext";

export const EmployeeDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const EmployeeDashboardState = useSelector((state) => state.EmployeeDashboardReducer);
    const [activeTab, setActiveTab] = useState("tasks");
    const [hrPartner, setHrPartner] = useState(null);

    useEffect(() => {
        dispatch(HandleGetEmployeeProfile());
        dispatch(HandleGetEmployeeTasks());
    }, [dispatch]);

    useEffect(() => {
        if (EmployeeDashboardState.fetchProfile) {
            dispatch(HandleGetEmployeeProfile());
        }
    }, [EmployeeDashboardState.fetchProfile, dispatch]);

    useEffect(() => {
        if (EmployeeDashboardState.fetchTasks) {
            dispatch(HandleGetEmployeeTasks());
        }
    }, [EmployeeDashboardState.fetchTasks, dispatch]);

    useEffect(() => {
        const loadHRList = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/chat/conversations', {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    const hrConv = data.data.find(conv => conv.partnerRole === 'hr');
                    if (hrConv) {
                        setHrPartner(hrConv.partnerDetails);
                    }
                }
            } catch (error) {
                console.error('Error loading HR list:', error);
            }
        };
        
        if (activeTab === 'chat') {
            loadHRList();
        }
    }, [activeTab]);

    const handleLogout = async () => {
        try {
            const result = await dispatch(HandleEmployeeLogout());
            
            dispatch(resetEmployeeAuth());
            
            if (result.type === 'HandleEmployeeLogout/fulfilled') {
                localStorage.removeItem('employeeData');
                navigate('/', { replace: true });
            } else {
                localStorage.removeItem('employeeData');
                navigate('/', { replace: true });
            }
        } catch (error) {
            dispatch(resetEmployeeAuth());
            localStorage.removeItem('employeeData');
            navigate('/', { replace: true });
        }
    };

    if (EmployeeDashboardState.isLoading && !EmployeeDashboardState.profile) {
        return <Loading />;
    }

    const profile = EmployeeDashboardState.profile || {};
    const tasks = EmployeeDashboardState.tasks || [];

    const currentUser = {
        id: profile.id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        role: 'employee'
    };

    return (
        <SocketProvider userRole="employee">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Welcome, {profile.firstname} {profile.lastname}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">{profile.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <EmployeeStats tasks={tasks} />

                <div className="mt-6 bg-white rounded-lg border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab("tasks")}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "tasks"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                My Tasks ({tasks.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "profile"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                My Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("chat")}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "chat"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                Chat with HR
                            </button>
                        </nav>
                    </div>

                    <div className={activeTab === "chat" ? "h-[600px]" : "p-6"}>
                        {activeTab === "tasks" && <EmployeeTaskList tasks={tasks} />}
                        {activeTab === "profile" && <EmployeeProfile profile={profile} />}
                        {activeTab === "chat" && (
                            <ChatWindow
                                partner={hrPartner}
                                currentUser={currentUser}
                                onClose={() => setActiveTab("tasks")}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
        </SocketProvider>
    );
};
