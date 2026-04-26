import React, { useEffect } from 'react'
import Usercard from './Usercard'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../utils/userSlice';
import EditProfile from './EditProfile';
import axios from 'axios';

const Profile = () => {
  const userData = useSelector((store)=>store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const fetchUser = async()=>{
    try{
    const res= await axios.get(BASE_URL+"/profile",{withCredentials:true});
    if(!res.data){
      return navigate("/login");
    }
    dispatch(addUser(res.data));
  }
  catch(err){
    console.log(err.message);
    navigate("/login");
  }
}

  useEffect(()=>{
    if(!userData){
      fetchUser();
    }
  },[userData]);


  return (
    userData && (
    <div>
      <EditProfile user={userData}/>
    </div>
    )
  )
}

export default Profile