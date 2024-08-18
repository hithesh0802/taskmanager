import React, { useState } from 'react';
import { createProject } from '../context/api'; 

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result,setResult]=useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result=await createProject({ title, description });
      console.log(result);
      setResult(result);
    } catch (error) {
      console.error('Failed to create project:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
      />
      <button type="submit">Create Project</button>
    </form>
  );
};

export default CreateProject;
