import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
        return action.payload;
        },
        removeUserFromFeed:(state,action)=>{
            const newFeed = state.filter((user)=> user._id!= action.payload); //action.payload is the _id passed to it
            return newFeed //This will return array of newFeed where current feed will no be presnt
        }
    }
})

export const {addFeed,removeUserFromFeed} = feedSlice.actions;
export default feedSlice.reducer;
