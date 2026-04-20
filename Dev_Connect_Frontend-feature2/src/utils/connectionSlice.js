import { createSlice } from "@reduxjs/toolkit";
import { addUser } from "./userSlice";

const connectionSlice = createSlice({
    name:"connection",
    initialState:[],
    reducers:{
        addConnections:(state,action)=>{
            return action.payload;
        },
        removeConnection:(state,action)=>{
            const newArray = state.filter((r)=> r._id!= action.payload); //action.payload is the _id passed to it
            return newArray //This will return array of  where This request will not be presnt
        }

        
    }
})

export const {addConnections,removeConnection} = connectionSlice.actions;
export default connectionSlice.reducer;

