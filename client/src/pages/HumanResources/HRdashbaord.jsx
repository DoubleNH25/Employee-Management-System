import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { HRdashboardSidebar } from "../../components/ui/HRsidebar.jsx"
import { Outlet } from "react-router-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

export const HRDashbaord = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const pathArray = location.pathname.split("/")

    return (
        <div className="HR-dashboard-container flex min-h-screen bg-purple-50">

            <div className="HRDashboard-sidebar">
                <SidebarProvider>
                    <HRdashboardSidebar />
                    <div className="sidebar-container min-[250px]:absolute md:relative z-50">
                        <SidebarTrigger className="bg-white shadow-md hover:bg-purple-50" />
                    </div>
                </SidebarProvider>
            </div>
            <div className="HRdashboard-container h-screen w-full min-[250px]:mx-1 md:mx-4 flex flex-col py-4">
                <Outlet />
            </div>
        </div>
    )
}