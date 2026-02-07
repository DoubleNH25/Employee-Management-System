import { KeyDetailBoxContentWrapper } from "../../../components/common/Dashboard/contentwrappers.jsx"
import { SalaryChart } from "../../../components/common/Dashboard/salarychart.jsx"
import { DataTable } from "../../../components/common/Dashboard/datatable.jsx"
import { useEffect } from "react"
import { HandleGetDashboard } from "../../../redux/Thunks/DashboardThunk.js"
import { useDispatch, useSelector } from "react-redux"
import { Loading } from "../../../components/common/loading.jsx"

export const HRDashboardPage = () => {
    const DashboardState = useSelector((state) => state.dashboardreducer)
    const dispatch = useDispatch()
    
    const DataArray = [
        {
            image: "/../../src/assets/HR-Dashboard/employee-2.png",
            dataname: "employees",
            path: "employees"
        },
        {
            image: "/../../src/assets/HR-Dashboard/department.png",
            dataname: "departments",
            path: "departments",
        }
    ]

    useEffect(() => {
        dispatch(HandleGetDashboard({ apiroute: "GETDATA" }))
    }, [dispatch])

    if (DashboardState.isLoading) { 
        return <Loading />
    }

    return (
        <div className="dashboard-page p-6 space-y-6 overflow-auto">
            {/* Welcome Section */}
            <div className="welcome-section bg-purple-600 rounded-xl p-6 text-white shadow-md">
                <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
                <p className="text-purple-100 text-sm">Welcome back! Here's what's happening with your organization.</p>
            </div>

            {/* Stats Cards */}
            <KeyDetailBoxContentWrapper imagedataarray={DataArray} data={DashboardState.data} />
            
            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold text-purple-600 mb-4">
                        Salary Overview
                    </h2>
                    <SalaryChart dashboardData={DashboardState.data} />
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow">
                    <h2 className="text-xl font-semibold text-purple-600 mb-4">
                        Recent Announcements
                    </h2>
                    <DataTable noticedata={null} />
                </div>
            </div>
        </div>
    )
}