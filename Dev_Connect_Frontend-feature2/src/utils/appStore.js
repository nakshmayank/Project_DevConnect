import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";  //you could give any name to the import object.It would be always userSlice.reducer and it is an object containg all reducer methods of the userSlice
{/* A reducer decide how the state will change when an action is dispatched*/} 
import feedReducer from "./feedSlice";
import ConnectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import reviewReducer from "./reviewSlice";

    const appStore = configureStore({
  reducer: {
    user: userReducer, //user is slice name to be used to find that slice from store
    feed: feedReducer,
    connections:ConnectionReducer,
    requests:requestReducer,
    review:reviewReducer,
  },
}); 

export default appStore;
