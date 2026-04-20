import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body =()=>{
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const userData = useSelector((store)=>store.user);
    const fetchUser = async () =>{
        try{
            const res = await axios.get(BASE_URL+"/profile",{withCredentials:true});
            dispatch(addUser(res.data));
        }
        catch(err){
            console.log(err);
            if(err.status===401){
                navigate("/login");
            }
            else{
                console.log(err.message);
            }
        }
    }
    useEffect(()=>{
        if(!userData){  //to not make an api call if userData or token is present 
            fetchUser()
        }
    },[]);

   

   return (
  <div className="min-h-screen flex flex-col">

    <Navbar />

    {/* Main Content */}
    <main className="flex-grow">
      <Outlet />
    </main>

    <Footer />

  </div>
);
}

export default Body;