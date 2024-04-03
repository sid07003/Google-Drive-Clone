import React, { useEffect,useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import { context_data } from '../App';

export default function Home() {
    const navigate=useNavigate();
    const { setIsAuthenticated } = useContext(context_data);

    useEffect(() => {
        fetch("http://localhost:3001/checkAuth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
          .then((res) => {
            if (res.status === 401) {
              setIsAuthenticated(false);
              navigate("/login");
            }
            else{
              setIsAuthenticated(true);
              navigate("/mydrive")
            }
          })
          .catch((err) => {
            console.log(err);
          })
      })
  return (
    <div>
      
    </div>
  )
}
