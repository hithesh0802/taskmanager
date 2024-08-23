import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const SearchUsers = ({ projectId }) => {
  const [username, setUsername] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const API_URL = 'http://localhost:5000/api';
  const [currUser,setCurrUser]= useState([]);

  useEffect(()=>{
    const token= localStorage.getItem('token');
    const getData= async()=>{
        const response = await axios.get(`${API_URL}/users/getdetails`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
        })
        setCurrUser(response.data);          
    }    
    getData();
  },[]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const token= localStorage.getItem("token");
    try {
      const response = await axios.post(`${API_URL}/users/search`,{q: username}, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
      });
      setSearchResult(response.data.users);
      console.log(response.data);
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  const sendRequest = async (recipientId) => {
    
    try {
      if(!currUser) return;
      const token= localStorage.getItem("token");
      console.log(currUser.id ,currUser);
      const response = await axios.post(`${API_URL}/users/send-request`, {
        projectId: projectId,
        userId: recipientId
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }

  return (
    <div className="search-users-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for Users..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      <div className="search-results">
        {searchResult === null ? (
          <p>Please search for users.</p>  // Initial message before searching
        ) : searchResult.length > 0 ? (
          searchResult.map((user) => (
            <div key={user._id} className="friend-card">
              <p>{user.username}</p>
              <button onClick={() => sendRequest(user._id)}>Send Request</button>
            </div>
          ))
        ) : (
          <p>No Users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;