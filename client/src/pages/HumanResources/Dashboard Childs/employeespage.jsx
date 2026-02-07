import { ListWrapper } from "../../../components/common/Dashboard/ListDesigns"
import { HeadingBar } from "../../../components/common/Dashboard/ListDesigns"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { ListItems } from "../../../components/common/Dashboard/ListDesigns"
import { ListContainer } from "../../../components/common/Dashboard/ListDesigns"
import { AddEmployeesDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"

export const HREmployeesPage = () => {
    const dispatch = useDispatch()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const table_headings = ["Full Name", "Email", "Department", "Contact Number", "Actions"]

    useEffect(() => {
        if (HREmployeesState.fetchData) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }))
        }
    }, [HREmployeesState.fetchData, dispatch])

    useEffect(() => {
        dispatch(HandleGetHREmployees({ apiroute: "GETALL" }))
    }, [dispatch])

    if (HREmployeesState.isLoading) {
        return <Loading />
    }

    return (
        <div className="employee-page p-6 space-y-6 overflow-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-purple-600">
                        Employees
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your organization's employees ({HREmployeesState.data?.length || 0} total)
                    </p>
                </div>
                <AddEmployeesDialogBox />
            </div>

            {/* Employee List */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="overflow-x-auto">
                    <ListWrapper>
                        <HeadingBar table_layout={"grid-cols-5"} table_headings={table_headings} />
                    </ListWrapper>
                    <ListContainer>
                        <ListItems TargetedState={HREmployeesState} />
                    </ListContainer>
                </div>
            </div>
        </div>
    )
}