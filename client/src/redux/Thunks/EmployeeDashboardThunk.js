import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { APIsEndpoints } from "../apis/APIsEndpoints";

export const HandleGetEmployeeProfile = createAsyncThunk(
    "HandleGetEmployeeProfile",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.get(APIsEndpoints.EMPLOYEE_DASHBOARD.GET_PROFILE, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
        }
    }
);

export const HandleUpdateEmployeeProfile = createAsyncThunk(
    "HandleUpdateEmployeeProfile",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.patch(APIsEndpoints.EMPLOYEE_DASHBOARD.UPDATE_PROFILE, payload, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

export const HandleGetEmployeeTasks = createAsyncThunk(
    "HandleGetEmployeeTasks",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.get(APIsEndpoints.EMPLOYEE_DASHBOARD.GET_TASKS, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
        }
    }
);

export const HandleUpdateTaskStatus = createAsyncThunk(
    "HandleUpdateTaskStatus",
    async (payload, { rejectWithValue }) => {
        try {
            const { taskId, status } = payload;
            const response = await apiService.patch(
                `${APIsEndpoints.EMPLOYEE_DASHBOARD.UPDATE_TASK_STATUS}/${taskId}`,
                { status },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update task status");
        }
    }
);

export const HandleEmployeeLogout = createAsyncThunk(
    "HandleEmployeeLogout",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.post(APIsEndpoints.EMPLOYEE_ENDPOINTS.LOGOUT, {}, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to logout");
        }
    }
);
