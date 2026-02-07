import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"

import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { HandleHRLogout } from "../../redux/Thunks/HRThunk"
import { Building2, LayoutDashboard, Users, Briefcase, CheckSquare, MessageSquare, LogOut, UserCircle } from "lucide-react"

export function HRdashboardSidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const result = await dispatch(HandleHRLogout())
            
            if (result.type === 'HandleHRLogout/fulfilled') {
                localStorage.removeItem('hrData');
                navigate('/', { replace: true })
            } else {
                localStorage.removeItem('hrData');
                navigate('/', { replace: true })
            }
        } catch (error) {
            localStorage.removeItem('hrData');
            navigate('/', { replace: true })
        }
    }

    return (
        <Sidebar className="border-r border-purple-100">
            <SidebarHeader className="border-b border-purple-100 p-4">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-600 p-2 rounded-lg">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-purple-600">
                            HR Admin
                        </h2>
                        <p className="text-xs text-gray-500">Management Portal</p>
                    </div>
                </div>
            </SidebarHeader>
            
            <SidebarContent className="bg-purple-50/30">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2 p-3">

                            <NavLink to={"dashboard-data"} className={({ isActive }) => { return isActive ? "bg-purple-100 rounded-lg" : "" }}>
                                <SidebarMenuItem className="flex gap-3 hover:bg-purple-100 rounded-lg transition-all">
                                    <LayoutDashboard className="w-5 h-5 ms-3 my-2 text-purple-600" />
                                    <span className="text-[15px] font-medium text-gray-700">Dashboard</span>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"employees"} className={({ isActive }) => { return isActive ? "bg-purple-100 rounded-lg" : "" }}>
                                <SidebarMenuItem className="flex gap-3 hover:bg-purple-100 rounded-lg transition-all">
                                    <Users className="w-5 h-5 ms-3 my-2 text-purple-600" />
                                    <span className="text-[15px] font-medium text-gray-700">Employees</span>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"departments"} className={({ isActive }) => { return isActive ? "bg-purple-100 rounded-lg" : "" }}>
                                <SidebarMenuItem className="flex gap-3 hover:bg-purple-100 rounded-lg transition-all">
                                    <Briefcase className="w-5 h-5 ms-3 my-2 text-purple-600" />
                                    <span className="text-[15px] font-medium text-gray-700">Departments</span>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"tasks"} className={({ isActive }) => { return isActive ? "bg-purple-100 rounded-lg" : "" }}>
                                <SidebarMenuItem className="flex gap-3 hover:bg-purple-100 rounded-lg transition-all">
                                    <CheckSquare className="w-5 h-5 ms-3 my-2 text-purple-600" />
                                    <span className="text-[15px] font-medium text-gray-700">Tasks</span>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"chat"} className={({ isActive }) => { return isActive ? "bg-purple-100 rounded-lg" : "" }}>
                                <SidebarMenuItem className="flex gap-3 hover:bg-purple-100 rounded-lg transition-all">
                                    <MessageSquare className="w-5 h-5 ms-3 my-2 text-purple-600" />
                                    <span className="text-[15px] font-medium text-gray-700">Chat</span>
                                </SidebarMenuItem>
                            </NavLink>

                            <div className="my-4 border-t border-purple-200"></div>

                            <NavLink to={"profile"} className={({ isActive }) => { return isActive ? "bg-purple-100 rounded-lg" : "" }}>
                                <SidebarMenuItem className="flex gap-3 hover:bg-purple-100 rounded-lg transition-all">
                                    <UserCircle className="w-5 h-5 ms-3 my-2 text-purple-600" />
                                    <span className="text-[15px] font-medium text-gray-700">Profile</span>
                                </SidebarMenuItem>
                            </NavLink>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton 
                                    className="gap-3 bg-red-500 hover:bg-red-600 text-white hover:text-white rounded-lg transition-all" 
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-5 h-5 ms-1" />
                                    <span className="text-[15px] font-semibold">Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )

}
