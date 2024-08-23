import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../context/api'; 
import CreateProject from '../pages/CreateProject';
import '../styling/projectlist.css';
import { io } from 'socket.io-client';
import SearchUsers from './Search';
import PendingRequests from './PendingRequest';

// const ProjectList = () => {
//   const [projects, setProjects] = useState([]);
//   // const socket = io('http://localhost:5000'); 

//   const getProjects = async () => {
//     const results = await fetchProjects();
//     setProjects(results.projects);
//   };

//   useEffect(() => {
//     getProjects();
//   }, );
//     // projects.forEach(project => {
//     //   socket.emit('joinProjectRoom', { projectId: project._id });

//     //   socket.on('taskUpdated', data => {
//     //     setProjects(prevProjects => prevProjects.map(p => 
//     //       p._id === data.task.project ? {...p, tasks: p.tasks.map(t => t._id === data.task._id ? data.task : t)} : p
//     //     ));
//     //   });

//     //   socket.on('taskCreated', data => {
//     //     setProjects(prevProjects => prevProjects.map(p => 
//     //       p._id === data.task.project ? {...p, tasks: [...p.tasks, data.task]} : p
//     //     ));
//     //   });

//     //   socket.on('taskDeleted', data => {
//     //     setProjects(prevProjects => prevProjects.map(p => 
//     //       p._id === data.projectId ? {...p, tasks: p.tasks.filter(t => t._id !== data.taskId)} : p
//     //     ));
//     //   });
//     // });

//     // return () => {
//     //   projects.forEach(project => {
//     //     socket.emit('leaveProjectRoom', { projectId: project._id });
//     //   });
//     //   socket.disconnect();
//     // };
//     //[projects, socket]
  

//   return (
//     <div className="project-management-container">
//       <CreateProject />
//       <h3 className="pending-requests-heading">Pending Requests</h3>
//             <PendingRequests />
//       <h1 className="project-heading">Projects</h1>
//       <div className="project-list">
//         {projects.map(project => (
//           <div className="project-card" key={project._id}>
//             <h2 className="project-title">{project.title}</h2>
//             <p className="project-description">{project.description}</p>

//             <h3 className="task-heading">Tasks</h3>
//             <ul className="task-list">
//               {project.tasks.map(task => (
//                 <li className="task-item" key={task._id}>
//                   <strong className="task-title">{task.title}</strong> - {task.description}
//                 </li>
//               ))}
//             </ul>

//             <h3 className="collaborator-heading">Add Collaborator</h3>
//             <SearchUsers projectId={project._id} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    const results = await fetchProjects(); // Define fetchProjects in your API utility
    setProjects(results.projects);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="project-management-page">
      <div className="header-section">
        <h1 className="main-heading">My Projects</h1>
        <CreateProject />
      </div>
      <PendingRequests />
      <div className="project-list">
        {projects.map(project => (
          <div className="project-card" key={project._id}>
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>

            <h3 className="task-heading">Tasks</h3>
            <ul className="task-list">
              {project.tasks.map(task => (
                <li className="task-item" key={task._id}>
                  <strong className="task-title">{task.title}</strong> - {task.description}
                </li>
              ))}
            </ul>

            <h3 className="collaborator-heading">Add Collaborator</h3>
            <SearchUsers projectId={project._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;