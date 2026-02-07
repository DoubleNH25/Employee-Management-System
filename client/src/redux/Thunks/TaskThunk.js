import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { APIsEndpoints } from "../apis/APIsEndpoints";

export const HandleGetAllTasks = createAsyncThunk(
    "HandleGetAllTasks",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.get(APIsEndpoints.TASK_ENDPOINTS.GET_ALL_TASKS, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
        }
    }
);

export const HandleCreateTask = createAsyncThunk(
    "HandleCreateTask",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.post(APIsEndpoints.TASK_ENDPOINTS.CREATE_TASK, payload, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create task");
        }
    }
);

export const HandleUpdateTask = createAsyncThunk(
    "HandleUpdateTask",
    async (payload, { rejectWithValue }) => {
        try {
            const { taskId, ...updateData } = payload;
            const response = await apiService.patch(`${APIsEndpoints.TASK_ENDPOINTS.UPDATE_TASK}/${taskId}`, updateData, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update task");
        }
    }
);

export const HandleDeleteTask = createAsyncThunk(
    "HandleDeleteTask",
    async (payload, { rejectWithValue }) => {
        try {
            const { taskId } = payload;
            const response = await apiService.delete(`${APIsEndpoints.TASK_ENDPOINTS.DELETE_TASK}/${taskId}`, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete task");
        }
    }
);

export const HandleGetTaskStatistics = createAsyncThunk(
    "HandleGetTaskStatistics",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiService.get(APIsEndpoints.TASK_ENDPOINTS.GET_TASK_STATISTICS, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch task statistics");
        }
    }
);

export const HandleGetEmployeeTasks = createAsyncThunk(
    "HandleGetEmployeeTasks",
    async (payload, { rejectWithValue }) => {
        try {
            const { employeeId } = payload;
            const response = await apiService.get(`${APIsEndpoints.TASK_ENDPOINTS.GET_EMPLOYEE_TASKS}/${employeeId}`, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch employee tasks");
        }
    }
);
