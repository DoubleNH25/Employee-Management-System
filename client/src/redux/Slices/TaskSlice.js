import { createSlice } from "@reduxjs/toolkit";
import { 
    HandleGetAllTasks, 
    HandleCreateTask, 
    HandleUpdateTask, 
    HandleDeleteTask,
    HandleGetTaskStatistics 
} from "../Thunks/TaskThunk";

const initialState = {
    isLoading: false,
    data: [],
    statistics: {
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0
    },
    fetchData: true,
    error: null,
    success: false,
    message: ""
};

const TaskSlice = createSlice({
    name: "TaskSlice",
    initialState,
    reducers: {
        resetTaskState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
            state.message = "";
        },
        setFetchData: (state, action) => {
            state.fetchData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(HandleGetAllTasks.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleGetAllTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload.data;
            state.success = true;
            state.message = action.payload.message;
            state.fetchData = false;
        });
        builder.addCase(HandleGetAllTasks.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
            state.fetchData = false;
        });

        builder.addCase(HandleCreateTask.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleCreateTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload.message;
            state.fetchData = true;
        });
        builder.addCase(HandleCreateTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        });

        builder.addCase(HandleUpdateTask.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleUpdateTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload.message;
            state.fetchData = true;
        });
        builder.addCase(HandleUpdateTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        });

        builder.addCase(HandleDeleteTask.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(HandleDeleteTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload.message;
            state.fetchData = true;
        });
        builder.addCase(HandleDeleteTask.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        });

        builder.addCase(HandleGetTaskStatistics.pending, (state) => {
            state.error = null;
        });
        builder.addCase(HandleGetTaskStatistics.fulfilled, (state, action) => {
            state.statistics = action.payload.data;
        });
        builder.addCase(HandleGetTaskStatistics.rejected, (state, action) => {
            state.error = action.payload;
        });
    }
});

export const { resetTaskState, setFetchData } = TaskSlice.actions;
export default TaskSlice.reducer;