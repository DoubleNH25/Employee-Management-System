import { HRDepartmentTabs } from "../../../components/common/Dashboard/departmenttabs"
import { CreateDepartmentDialogBox } from "../../../components/common/Dashboard/dialogboxes"
import { useSelector } from "react-redux"

export const HRDepartmentPage = () => {
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)
    
    return (
        <div className="department-page p-6 space-y-4 overflow-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-purple-600">Departments</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Organize and manage your departments ({HRDepartmentState.data?.length || 0} total)
                    </p>
                </div>
                <CreateDepartmentDialogBox />
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <HRDepartmentTabs />
            </div>
        </div>
    )
}