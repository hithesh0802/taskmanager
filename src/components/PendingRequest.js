import React, { useEffect, useState } from 'react';
import { fetchPendingRequests, handleRequest } from '../context/api'; 
import axios from 'axios';
import '../styling/pendingreq.css';

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
      setPendingRequests(response.data.requests);
      console.log(response.data.requests);
    } catch (error) {
      console.error('Error fetching collaborator requests:', error);
    }
  }

  useEffect(() => {
    getPendingRequests();
  },[])

  const acceptRequest = async (projectId,res) => {
    console.log(projectId);
    try{
      const token= localStorage.getItem("token");
      var condition;
      if(res === "accept"){
        condition="accept";
      }else{
        condition="reject";
      }
      console.log(`${API_URL}/users/accept-request`,{projectId,res},{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const results = await axios.post(`${API_URL}/users/accept-request`,{projectId,res},{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
        {pendingRequests.length > 0 ? (
          pendingRequests.map(request => (
            <li key={request.projectId}>
              <h3>{request.title}</h3>
              <h5>{request.description}</h5>
              <button onClick={() => acceptRequest(request.projectId, 'accept')}>
                Accept
              </button>
              <button onClick={() => acceptRequest(request.projectId, 'reject')}>
                Reject
              </button>
            </li>
          ))
        ) : (
          <p>No pending requests</p>
        )}
      </ul>
    </div>
  );
};

export default PendingRequests;

