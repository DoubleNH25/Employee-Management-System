import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { HRDepartmentPageEndPoints } from "../apis/APIsEndpoints";

export const HandleGetHRDepartments = createAsyncThunk('HandleGetHRDepartments', async (HRDepartmentPageData, { rejectWithValue }) => {
    try {
        const { apiroute } = HRDepartmentPageData;
        const response = await apiService.get(`${HRDepartmentPageEndPoints[apiroute]}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandlePostHRDepartments = createAsyncThunk('HandlePostHRDepartments', async (HRDepartmentPageData, { rejectWithValue }) => {
    try {
        const { apiroute, data } = HRDepartmentPageData;
        const response = await apiService.post(`${HRDepartmentPageEndPoints[apiroute]}`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandlePatchHRDepartments = createAsyncThunk('HandlePatchHRDepartments', async (HRDepartmentPageData, { rejectWithValue }) => {
    try {
        const { apiroute, data } = HRDepartmentPageData;
        
        let endpoint;
        if (apiroute.startsWith('UPDATE.')) {
            const departmentId = apiroute.split('.')[1];
            endpoint = HRDepartmentPageEndPoints.UPDATE(departmentId);
        } else {
            endpoint = HRDepartmentPageEndPoints[apiroute];
        }
        
        const response = await apiService.patch(endpoint, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const HandleDeleteHRDepartments = createAsyncThunk("HandleDeleteHRDepartments", async (HRDepartmentPageData, { rejectWithValue }) => {
    try {
        const { apiroute } = HRDepartmentPageData;
        
        let endpoint;
        if (apiroute.startsWith('DELETE.')) {
            const departmentId = apiroute.split('.')[1];
            endpoint = HRDepartmentPageEndPoints.DELETE(departmentId);
        } else {
            endpoint = HRDepartmentPageEndPoints[apiroute];
        }
        
        const response = await apiService.delete(endpoint, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
