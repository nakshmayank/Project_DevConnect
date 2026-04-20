// import React, { useEffect } from 'react'
// import { BASE_URL } from '../utils/constants'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { removeUser } from '../utils/userSlice'

// const Logout = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const handleLogOut=async()=>{
//         await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
//         dispatch(removeUser());
//         return navigate("/");
//     }
//     useEffect(()=>{
//         handleLogOut();
//     },[]);

//   return (
//     <div>
//         <p>Logging out.....</p>
//     </div>
//   )
// }

// export default Logout

import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeUser } from '../utils/userSlice'

const Logout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        try {

            await axios.post(
                BASE_URL + "/logout",
                {},
                { withCredentials: true }
            );

        } catch (err) {
            console.log("Logout API failed:", err.message);
        } finally {
            // Always clear user on frontend
            dispatch(removeUser());
            navigate("/");
        }
    }

    useEffect(() => {
        handleLogOut();
    }, []);

    return (
        <div>
            <p>Logging out.....</p>
        </div>
    )
}

export default Logout;