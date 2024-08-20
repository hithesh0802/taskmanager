import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks,createTask,deleteTask,editingTask,deleteLabel,fetchProjects } from '../context/api';
import { io } from 'socket.io-client';
import '../styling/dashboard.css';
import ListItem from '../components/ListItem';

const DashBoard = () => {
    const [tasks, setTasks] = useState([]);
    const navigate= useNavigate();
    const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]); 
    const [titleTask, setTitleTask] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskProgress, setTaskProgress] = useState(0);
    const [labels,setLabels] = useState([]);
    const [newLabel, setNewLabel] = useState('');
    const [result, setResult] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [taskEditing,setTaskEditing]=useState([]);
    const [filterLabel, setFilterLabel] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const socket = io('http://localhost:5000');

    useEffect(() => {
        const getTasks = async () => {
            const token = localStorage.getItem('token');
            const results = await fetchTasks(token);
            setTasks(results.tasks);
            setTasks(tasks => tasks?.sort((a,b)=> new Date(a.deadline) - new Date(b.deadline)));
        };
        getTasks();

        socket.on('tasksUpdated', updatedTasks => {
            setTasks(updatedTasks.tasks);
        });

        return () => {
            socket.off('tasksUpdated');
        };
    }, []);

    useEffect(() => {
        const getProjects = async () => {
          const results = await fetchProjects();
          setProjects(results.projects);
        };
        getProjects();

        socket.on('projectsUpdated', updatedProjects => {
            setProjects(updatedProjects);
        });
    
        return () => {
            socket.off('projectsUpdated');
        };
      }, []);

    const handleAddLabel = (e) => {
        e.preventDefault();
        if (newLabel && !labels.includes(newLabel.trim())) {
            setLabels([...labels, newLabel.trim()]);
            setNewLabel(''); 
        }
    };

    const handleRemoveLabel = async (labelToRemove,task) => {
        setLabels(labels.filter(label => label !== labelToRemove));
        const token = localStorage.getItem('token');
        try{
            let result= await deleteLabel(token,task._id,labelToRemove);
            console.log(result);
            setTasks(prevTasks => 
                prevTasks.map(t => 
                    t._id === task._id 
                    ? { ...t, labels: t.labels.filter(label => label !== labelToRemove) } 
                    : t
                )
            );
        }catch(error){
            console.error('Failed to delete label:', error.message);
        }
    };

    const filterTasksByLabel = () => {
        if (!filterLabel) return tasks; 
        return tasks.filter(task => task.labels.includes(filterLabel));
    };

    const handleTaskDelete=async(taskId) =>{
        try {
            const token = localStorage.getItem('token');
            let result= await deleteTask(token, taskId);
            setTasks(tasks.filter(task => task._id !== taskId)); 
        } catch (error) {
            console.error('Failed to delete task:', error.message);
        }
    }

    const handleEditTask = async(e,taskId) =>{
        e.preventDefault();
        console.log(taskEditing.project? taskEditing.project[0] : null);
        try{
            const token= localStorage.getItem('token');
            const projectIdToSend = projectId || (taskEditing.project && taskEditing.project.length > 0 ? taskEditing.project[0] : null);
            let result= await editingTask(token,{taskId,titleTask: titleTask || taskEditing.title, taskDescription: taskDescription || taskEditing.description, deadline: deadline|| taskEditing.deadline.split('T')[0], taskProgress: taskProgress || taskEditing.progress , labels: labels || taskEditing.labels , projectId: projectIdToSend } );
            console.log(result);

            const results = await fetchTasks(token);
            setTasks(results.tasks);
            setEditingTaskId(null);
            setTaskEditing([]);
            setIsEditing(false);
            setTitleTask('');
            setTaskDescription('');
            setDeadline(new Date().toISOString().split('T')[0]);
            setTaskProgress(0);
            setLabels([]);
            setNewLabel("");
            setProjectId("");
        }catch(error){
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(titleTask, taskDescription, deadline, taskProgress );
        try {
            const token = localStorage.getItem('token');
            const results = await createTask({
                token,
                title: titleTask,
                description: taskDescription,
                deadline: deadline, 
                progress: taskProgress,
                labels: labels,
                project: projectId
            });
            setResult("Created!");
            console.log(results);
            const result = await fetchTasks(token);
            setTasks(result.tasks);
        } catch (error) {
            console.log({ message: error.message });
        }
    };

    const gotoProjects=()=>{
        navigate('/project');
    }

    return (
        <div className="dashboard-page">
        <button className="create" onClick={gotoProjects}>Projects</button>
        <h1>Your Tasks:</h1>
        <div className="filter-section">
            <label>Filter by Label:</label>
            <select value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)}>
                <option value="">All</option>
                {Array.from(new Set(tasks.flatMap(task => task.labels))).map((label, index) => (
                    <option key={index} value={label}>{label}</option>
                ))}
            </select>
        </div>

        {editingTaskId && (
            <form className="dashboard-task-form" onSubmit={(e) => handleEditTask(e, editingTaskId)}>
                <div className="dashboard-form-group">
                    <input
                        type="text"
                        value={titleTask || taskEditing?.title || ''}
                        onChange={(e) => setTitleTask(e.target.value)}
                        placeholder="Task Title"
                    />
                    <input
                        type="text"
                        value={taskDescription || taskEditing?.description || ''}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Task Description"
                    />
                    <input
                        type="date"
                        value={deadline || taskEditing?.deadline?.split('T')[0] || ''}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    <label htmlFor='range'>Drag to select your current Progress</label>
                    <input
                        required type='range' id='range' min={0} max={100} name='progress'
                        value={taskProgress || taskEditing?.progress || 0}
                        onChange={(e) => setTaskProgress(Number(e.target.value))}
                        placeholder="Task Progress"
                    />
                    <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.title}
                        </option>
                        ))}
                    </select>
                    <div className="labels-section">
                        <input 
                            type='text'
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="Add a label"
                        />
                        <button onClick={handleAddLabel}>Add Label</button>
                    </div>
                </div>
                <button className="dashboard-submit-button" type="submit">Edit</button>
            </form>
        )}

        <div className="dashboard">
            {tasks && (
                <div className="dashboard-task-list">
                    {filterTasksByLabel().map((task, index) => (
                        <div className="dashboard-task-card" key={index}>
                            <div className="dashboard-task-header">
                                <h4>{task.title}</h4>
                                <div className="dashboard-task-actions">
                                    <button className="dashboard-task-button delete" onClick={() => handleTaskDelete(task._id)}>Delete</button>
                                    <button className="dashboard-task-button edit" onClick={() => { setIsEditing(true); setEditingTaskId(task._id); setTaskEditing(task); }}>Edit</button>
                                </div>
                            </div>
                            <div className="dashboard-task-details">Description: {task.description}</div>
                            <div className="dashboard-task-deadline">Deadline: {new Date(task.deadline).toLocaleDateString()}</div>
                            <div className="dashboard-task-progress">Progress: {task.progress}%</div>
                            <div className="labels-list">
                                {task.labels?.map((label, index) => (
                                    <span key={index} className="label-tag">
                                        <p style={{ color: 'black' }}>{label}</p>
                                        <button type="button" onClick={() => handleRemoveLabel(label,task)}>x</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {!isEditing && (
            <div className="dashboard-create-task">
                <h3>Create Task: {result}</h3>
                <form className="dashboard-task-form" onSubmit={handleSubmit}>
                    <div className="dashboard-form-group">
                        <input
                            type="text"
                            value={titleTask}
                            onChange={(e) => setTitleTask(e.target.value)}
                            placeholder="Task Title"
                        />
                        <input
                            type="text"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder="Task Description"
                        />
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            placeholder="Task Deadline"
                        />
                        <label htmlFor='range'>Drag to select your current Progress</label>
                        <input
                            required type='range' id='range' min={0} max={100} name='progress'
                            value={taskProgress}
                            onChange={(e) => setTaskProgress(Number(e.target.value))} 
                            placeholder="Task Progress"
                        />
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                        >
                            <option value="">Select Project</option>
                            {projects.map(project => (
                            <option key={project._id} value={project._id}>
                                {project.title}
                            </option>
                            ))}
                        </select>
                        <div className="labels-section">
                            <input 
                                type='text'
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Add a label"
                            />
                            <button onClick={handleAddLabel}>Add Label</button>
                        </div>
                    </div>
                    <button className="dashboard-submit-button" type="submit">Submit</button>
                </form>
            </div>
        )}
    </div>
    );
}

export default DashBoard;
