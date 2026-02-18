import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = ()=>{
    try{
        const user = localStorage.getItem("user");
        return user?JSON.parse(user):null;
    }catch(err){
        console.error("Invalide JSON in localStorage user:", err);
        return null;
    }

};

const getTokenFromStorage = ()=>{
    return localStorage.getItem("token")||null;
};

const initialState = {
    user:getUserFromStorage(),
    token:getTokenFromStorage()
};

const authSlice = createSlice({
    name:"auth",
    initialState,

    reducers:{
        loginSuccess: (state,action)=>{
            //store in redux
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem("user",JSON.stringify(action.payload.user));
            localStorage.setItem("token",action.payload.token);
        },

        logout:(state)=>{
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
});

export const {loginSuccess,logout} = authSlice.actions;
export default authSlice.reducer;