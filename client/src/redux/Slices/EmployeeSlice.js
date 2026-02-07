import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AsyncReducer } from "../AsyncReducers/asyncreducer"
import { HandlePostEmployees, HandleGetEmployees } from "../Thunks/EmployeeThunk"
import { HandleEmployeeLogout } from "../Thunks/EmployeeDashboardThunk"

const EmployeeSlice = createSlice({
    name: 'employees',
    initialState: {
        data: null, 
        isLoading: false,
        isAuthenticated: false,
        isAuthourized: false,
        isResetPasswords: false,
        error: {
            status: false,
            message: null,
            content: null
        }
    },
    reducers: {
        resetEmployeeAuth: (state) => {
            state.isAuthenticated = false;
            state.isAuthourized = false;
            state.data = null;
        },
        clearEmployeeError: (state) => {
            state.error.status = false;
            state.error.message = null;
            state.error.content = null;
        }
    },
    extraReducers: (builder) => {
        AsyncReducer(builder, HandlePostEmployees); 
        AsyncReducer(builder, HandleGetEmployees);
        
        builder.addCase(HandleEmployeeLogout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.isAuthourized = false;
            state.data = null;
        });
    }
})

export const { resetEmployeeAuth, clearEmployeeError } = EmployeeSlice.actions;
export default EmployeeSlice.reducer