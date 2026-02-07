import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect, useRef } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector, useDispatch } from "react-redux"
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk"
import { Loading } from "../loading.jsx"
import { HeadingBar } from "./ListDesigns.jsx"
import { DepartmentListItems } from "./ListDesigns.jsx"
import { useToast } from "../../../hooks/use-toast.js"
import { EmployeesIDSDialogBox, UpdateDepartmentDialogBox, DeleteDepartmentDialogBox } from "./dialogboxes.jsx"



export const HRDepartmentTabs = () => {
    const { toast } = useToast()
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)
    const dispatch = useDispatch()
    const [department, setdepartment] = useState("All Departments")
    const lastSuccessRef = useRef(null)
    const lastErrorRef = useRef(null)
    const renderCountRef = useRef(0)

    renderCountRef.current += 1

    const departments = []

    if (HRDepartmentState.data) {
        for (let index = 0; index < HRDepartmentState.data.length; index++) {
            departments.push({
                value: HRDepartmentState.data[index].name,
                label: HRDepartmentState.data[index].name
            })
        }
    }

    useEffect(() => {
        if (HRDepartmentState.fetchData) {
            dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
        }
    }, [HRDepartmentState.fetchData, dispatch])

    useEffect(() => {
        if (HRDepartmentState.error.status && 
            lastErrorRef.current !== HRDepartmentState.error.message) {
            lastErrorRef.current = HRDepartmentState.error.message
            
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `${HRDepartmentState.error.message}`,
            })
        }
    }, [HRDepartmentState.error.status, HRDepartmentState.error.message])

    useEffect(() => {
        if (HRDepartmentState.success.status && 
            HRDepartmentState.success.message &&
            lastSuccessRef.current !== HRDepartmentState.success.message) {
            
            lastSuccessRef.current = HRDepartmentState.success.message
            
        } else if (!HRDepartmentState.success.status && lastSuccessRef.current !== null) {
            lastSuccessRef.current = null
        }
    }, [HRDepartmentState.success.status, HRDepartmentState.success.message])


    useEffect(() => {
        dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
    }, [])


    if (HRDepartmentState.isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="flex flex-col gap-4 bg-white min-[250px]:p-2 sm:p-4 h-[100%] overflow-auto">
            <div className="Dropdown-container flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="drop-down-select flex items-center gap-3 min-[250px]:flex-col sm:flex-row">
                    <h1 className="font-semibold text-base min-[250px]:hidden sm:flex text-gray-700">Department:</h1>
                    <ComboDropDown DepartmentData={departments} CurrentDepartment={department} SetCurrentDepartment={setdepartment} />
                </div>
                <div className="update-delete-department">
                    {department !== "All Departments" ?
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                    <img src="../../src/assets/HR-Dashboard/settings.png" alt="" className="w-5" />
                                    <span className="min-[250px]:hidden sm:flex">Settings</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col justify-center items-center p-2">
                                <div className="buttons flex flex-col gap-2 w-full">
                                    {HRDepartmentState.data && (() => {
                                        const currentDept = HRDepartmentState.data.find((item) => item.name === department);
                                        return currentDept ? (
                                            <>
                                                <UpdateDepartmentDialogBox 
                                                    departmentId={currentDept.id}
                                                    currentName={currentDept.name}
                                                    currentDescription={currentDept.description}
                                                />
                                                <DeleteDepartmentDialogBox 
                                                    departmentId={currentDept.id}
                                                    departmentName={currentDept.name}
                                                    employeeCount={currentDept.employeeIds?.length || 0}
                                                />
                                            </>
                                        ) : null;
                                    })()}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu> : null}
                </div>
            </div>
            <div className={`department-container flex flex-col gap-4 h-[100%]`}>
                {
                    department === "All Departments" ? <AllDepartments DepartmentData={HRDepartmentState} SetCurrentDepartment={setdepartment} /> :
                        <DepartmentContent CurrentDepartmentData={HRDepartmentState.data ? HRDepartmentState.data.find((item) => item.name == department) : null} />
                }
            </div>
        </div>

    )
}


export const ComboDropDown = ({ DepartmentData, CurrentDepartment, SetCurrentDepartment }) => {

    const [open, setOpen] = useState(false)

    return (
        <div className="departments-container">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="border-2 border-purple-500 w-4">
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-auto justify-between"
                    >
                        {CurrentDepartment}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Command>
                        <CommandInput placeholder="Search Departments..." />
                        <CommandList>
                            <CommandEmpty>No Departments found.</CommandEmpty>
                            <CommandGroup className="sm:text-sm lg:text-lg">
                                {DepartmentData.map((department) => (
                                    <CommandItem
                                        key={department.value}
                                        value={department.value}
                                        onSelect={(currentValue) => {
                                            SetCurrentDepartment(currentValue === CurrentDepartment ? "All Departments" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                CurrentDepartment === department.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {department.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}


export const DepartmentContent = ({ CurrentDepartmentData }) => {
    const table_headings_employees = ["Full Name", "Email", "Contact Number", "Remove Employee"]

    if (!CurrentDepartmentData) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <p className="text-gray-500">Department not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">{CurrentDepartmentData.name}</h1>
                <p className="text-sm text-gray-600">{CurrentDepartmentData.description}</p>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-b border-gray-200">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Department Employees</h2>
                        <p className="text-sm text-gray-500">
                            {CurrentDepartmentData.employeeIds ? CurrentDepartmentData.employeeIds.length : 0} team members
                        </p>
                    </div>
                    <EmployeesIDSDialogBox DepartmentID={CurrentDepartmentData.id} />
                </div>

                <div className="overflow-x-auto">
                    <HeadingBar table_layout={"grid-cols-4"} table_headings={table_headings_employees} />
                    <DepartmentListItems TargetedState={CurrentDepartmentData} />
                </div>
            </div>
        </div>
    )
}


export const AllDepartments = ({ DepartmentData, SetCurrentDepartment }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DepartmentData.data ? DepartmentData.data.map((department) => (
                <div 
                    key={department.name} 
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-purple-600 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => SetCurrentDepartment(department.name)}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {department.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {department.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            {department.employeeIds?.length || 0} employees
                        </span>
                        <span className="text-sm text-purple-600 font-medium">View →</span>
                    </div>
                </div>
            )) : null}
        </div>
    )
}
