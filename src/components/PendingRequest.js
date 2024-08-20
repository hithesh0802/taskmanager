import React, { useEffect, useState } from 'react';
import { fetchPendingRequests, handleRequest } from '../context/api'; 
import axios from 'axios';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const API_URL = 'http://localhost:5000/api';
  
  const getPendingRequests= async () => {
    try {
      const response = await axios.get(`${API_URL}/users/getrequests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching collaborator requests:', error);
    }
  }

  useEffect(() => {
    getPendingRequests();
  })

  const acceptRequest = async (projectId,res) => {
    try{
      var condition;
      if(res === "accept"){
        condition="accept";
      }else{
        condition="reject";
      }
      const results = await axios.post(`${API_URL}/users/accept-requests`,{projectId,condition},{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(results);
      alert('Request accepted /rejected');
    }catch(error){
      console.log('Error accepting/rejecting response',error);
    }
    getPendingRequests();
  };

  return (
    <div className="pending-requests">
      <h4>Pending Requests</h4>
      <ul>
        {pendingRequests.map(request => (
          <li key={request._id}>
            <h3>{request.title}</h3>
            <h5>{request.description}</h5> 
            <button onClick={() => acceptRequest(request._id,"accept")}>
              Accept
            </button>
            <button onClick={()=> acceptRequest(request._id,"reject")}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;

