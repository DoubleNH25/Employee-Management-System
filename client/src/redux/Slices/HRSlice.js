import { createSlice } from "@reduxjs/toolkit";
import { HRAsyncReducer } from "../AsyncReducers/asyncreducer.js";
import { HandlePostHumanResources, HandleGetHumanResources, HandleHRLogout, HandleGetMyProfile, HandleUpdateMyProfile } from "../Thunks/HRThunk.js";

const HRSlice = createSlice({
    name: "HumanResources",
    initialState: {
        data: null,
        profile: null,
        isLoading: false,
        isProfileLoading: false,
        isAuthenticated: false,
        isSignUp: false,
        isAuthourized: false,
        isVerified: false,
        isVerifiedEmailAvailable : false, 
        isResetPassword: false,
        error: {
            status: false,  
            message: null,
            content: null
        }
    },
    reducers: {
        clearHRError: (state) => {
            state.error.status = false;
            state.error.message = null;
            state.error.content = null;
        }
    },
    extraReducers: (builder) => {
        HRAsyncReducer(builder, HandlePostHumanResources)
        HRAsyncReducer(builder, HandleGetHumanResources)
        
        builder
            .addCase(HandleHRLogout.pending, (state) => {
                state.isLoading = true
                state.error.status = false
            })
            .addCase(HandleHRLogout.fulfilled, (state) => {
                state.isLoading = false
                state.isAuthenticated = false
                state.isAuthourized = false
                state.data = null
                state.profile = null
                state.error.status = false
            })
            .addCase(HandleHRLogout.rejected, (state, action) => {
                state.isLoading = false
                state.error.status = true
                state.error.message = action.payload?.message || "Logout failed"
            })
            
        builder
            .addCase(HandleGetMyProfile.pending, (state) => {
                state.isProfileLoading = true
                state.error.status = false
            })
            .addCase(HandleGetMyProfile.fulfilled, (state, action) => {
                state.isProfileLoading = false
                state.profile = action.payload.data
                state.error.status = false
            })
            .addCase(HandleGetMyProfile.rejected, (state, action) => {
                state.isProfileLoading = false
                state.error.status = true
                state.error.message = action.payload?.message || "Failed to load profile"
            })
            
        builder
            .addCase(HandleUpdateMyProfile.pending, (state) => {
                state.isProfileLoading = true
                state.error.status = false
            })
            .addCase(HandleUpdateMyProfile.fulfilled, (state, action) => {
                state.isProfileLoading = false
                state.profile = action.payload.data
                state.error.status = false
            })
            .addCase(HandleUpdateMyProfile.rejected, (state, action) => {
                state.isProfileLoading = false
                state.error.status = true
                state.error.message = action.payload?.message || "Failed to update profile"
            })
    }
})

export const { clearHRError } = HRSlice.actions;
export default HRSlice.reducer