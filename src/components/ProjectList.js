import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../context/api'; // Implement API call
import CreateProject from '../pages/CreateProject';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const results = await fetchProjects();
      setProjects(results.projects);
    };
    getProjects();
  }, []);

  return (
    <div>
      <CreateProject />

      <h1>Projects</h1>
      <div>
        {projects.map(project => (
          <div key={project._id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <h3>Tasks</h3>
            <ul>
              {project.tasks.map(task => (
                <li key={task._id}>
                  <strong>{task.title}</strong> - {task.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
