import { EmployeeDetailsDialogBox } from "./dialogboxes.jsx"
import { DeleteEmployeeDialogBox } from "./dialogboxes.jsx"
import { RemoveEmployeeFromDepartmentDialogBox } from "./dialogboxes.jsx"

export const ListWrapper = ({ children }) => {
    return (
        <div className={`wrapper-container p-2 border-2 border-purple-200 rounded-lg w-auto`}>
            {children}
        </div>
    )
}

export const HeadingBar = ({ table_layout, table_headings }) => {
    return (
        <div className={`heading-container grid min-[250px]:grid-cols-2 sm:${table_layout ? table_layout : `grid-cols-5`} gap-4 bg-gray-50 border-b border-gray-200`}>
            {
                table_headings.map((item, index) => <div key={index} className={`heading-content text-gray-700 font-semibold min-[250px]:text-xs xl:text-sm min-[250px]:p-2 sm:p-3 text-center flex justify-center items-center 
                ${(["Email", "Department", "Contact Number"].includes(item)) ? `min-[250px]:hidden sm:flex` : ""}`}>
                    {item}
                </div>)
            }
        </div>
    )
}

export const ListContainer = ({ children }) => {
    return (
        <div className={`list-item-container px-2 py-2 border-2 border-purple-200 rounded-lg w-auto`}>
            {children}
        </div>
    )
}

export const ListItems = ({ TargetedState }) => {
    return (
        <>
            {TargetedState.data ? TargetedState.data.map((item, index) => <div key={item.id || index} className={`list-item-container grid min-[250px]:grid-cols-2 sm:grid-cols-5 py-3 gap-2 justify-center items-center border-b border-gray-100 hover:bg-gray-50`}>
                <div className="heading-content font-medium min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-base p-2 text-start overflow-hidden text-ellipsis">
                    {`${item.firstname} ${item.lastname}`}
                </div>
                <div className="heading-content min-[250px]:text-sm sm:text-xs xl:text-base p-2 text-start overflow-hidden text-ellipsis min-[250px]:hidden sm:block text-gray-600">
                    {item.email}
                </div>
                <div className="heading-content min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-base p-2 text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block text-gray-600">
                    {item.department ? item.department.name : "Not Specified"}
                </div>
                <div className="heading-content min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-base p-2 text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block text-gray-600">
                    {item.contactnumber}
                </div>
                <div className="heading-content min-[250px]:text-xs xl:text-base p-2 text-center flex justify-center items-center min-[250px]:gap-1 xl:gap-2">
                    <EmployeeDetailsDialogBox EmployeeID={item.id} />
                    <DeleteEmployeeDialogBox EmployeeID={item.id} />
                </div>
            </div>) : null}
        </>
    )
}


export const DepartmentListItems = ({ TargetedState }) => {
    return (
        <>
            {TargetedState ? TargetedState.employees.map((item, index) => <div key={item.id || index} className={`list-item-container grid min-[250px]:grid-cols-2 sm:grid-cols-4 py-3 gap-2 justify-center items-center border-b border-gray-100 hover:bg-gray-50`}>
                <div className="heading-content font-medium min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-base p-2 text-center overflow-hidden text-ellipsis">
                    {`${item.firstname} ${item.lastname}`}
                </div>
                <div className="heading-content min-[250px]:text-sm sm:text-xs xl:text-base p-2 text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block text-gray-600">
                    {item.email}
                </div>
                <div className="heading-content min-[250px]:text-sm sm:text-xs lg:text-sm xl:text-base p-2 text-center overflow-hidden text-ellipsis min-[250px]:hidden sm:block text-gray-600">
                    {item.contactnumber}
                </div>
                <div className="heading-content min-[250px]:text-xs xl:text-base p-2 text-center flex justify-center items-center min-[250px]:gap-1 xl:gap-2">
                    <RemoveEmployeeFromDepartmentDialogBox DepartmentName={TargetedState.name} DepartmentID={TargetedState.id} EmployeeID={item.id}/>
                </div>
            </div>) : null}
        </>
    )
}
