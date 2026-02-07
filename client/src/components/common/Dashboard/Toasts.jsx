import { useToast } from "../../../hooks/use-toast.js"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef } from "react"
import { HandlePostHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
export const FormSubmitToast = ({ formdata }) => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)


    const SubmitFormData = async () => {
        dispatch(HandlePostHREmployees({ apiroute: "ADDEMPLOYEE", data: formdata })) 
    }

    return (
        <>
            <Button
                variant="outline"
                onClick={() => {
                    SubmitFormData()
                }}
                className="bg-blue-800 border-2 border-blue-800 px-4 py-2 text-white font-bold rounded-lg hover:bg-white hover:text-blue-800"
            >
                Add Employee
            </Button>
        </>
    )
}