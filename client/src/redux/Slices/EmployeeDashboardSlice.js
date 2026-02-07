import { createSlice } from "@reduxjs/toolkit";
import { 
    HandleGetEmployeeProfile,
    HandleUpdateEmployeeProfile,
    HandleGetEmployeeTasks,
    HandleUpdateTaskStatus
} from "../Thunks/EmployeeDashboardThunk";

const initialState = {
    isLoading: false,
    profile: null,
    tasks: [],
    error: null,
    success: false,
    message: "",
    fetchProfile: true,
    fetchTasks: true
};

const EmployeeDashboardSlice = createSlice({
    name: "EmployeeDashboardSlice",
    initialState,
    reducers: {
        resetEmployeeDashboardState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
            state.message = "";
        },
        setFetchProfile: (state, action) => {
            state.fetchProfile = action.payload;
        },
        setFetchTasks: (state, action) => {
            state.fetchTasks = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(HandleGetEmployeeProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleGetEmployeeProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profile = action.payload.data;
            state.fetchProfile = false;
        });
        builder.addCase(HandleGetEmployeeProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.fetchProfile = false;
        });

        builder.addCase(HandleUpdateEmployeeProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleUpdateEmployeeProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload.message;
            state.fetchProfile = true;
        });
        builder.addCase(HandleUpdateEmployeeProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        });

        builder.addCase(HandleGetEmployeeTasks.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleGetEmployeeTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tasks = action.payload.data;
            state.fetchTasks = false;
        });
        builder.addCase(HandleGetEmployeeTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.fetchTasks = false;
        });

        builder.addCase(HandleUpdateTaskStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleUpdateTaskStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload.message;
            state.fetchTasks = true;
        });
        builder.addCase(HandleUpdateTaskStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        });
    }
});

export const { resetEmployeeDashboardState, setFetchProfile, setFetchTasks } = EmployeeDashboardSlice.actions;
export default EmployeeDashboardSlice.reducer;
