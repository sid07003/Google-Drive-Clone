import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate=useNavigate();

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
              navigate("/login");
            }
            else{
              navigate("/home")
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
