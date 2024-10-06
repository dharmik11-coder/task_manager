import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, deleteProject, updateProject } from '../redux/projectSlice';
import { fetchTasks, addTask, updateTask, deleteTask } from '../redux/taskSlice'; 
import AddProject from './AddProject'; 

const ProjectList = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.projects.items);
    const tasks = useSelector((state) => state.tasks.items); 
    const projectStatus = useSelector((state) => state.projects.status);
    const error = useSelector((state) => state.projects.error);

    // Local state for editing projects
    const [editProjectId, setEditProjectId] = useState(null); 
    const [editProjectName, setEditProjectName] = useState('');
    const [newTask, setNewTask] = useState(''); 
    const [newTaskCompleted, setNewTaskCompleted] = useState(false); 
    const [addTaskForProject, setAddTaskForProject] = useState(null); 

    // Local state for editing tasks
    const [editTaskId, setEditTaskId] = useState(null); 
    const [editTaskName, setEditTaskName] = useState(''); 
    const [editTaskCompleted, setEditTaskCompleted] = useState(false); 

    useEffect(() => {
        if (projectStatus === 'idle') {
            dispatch(fetchProjects());
            dispatch(fetchTasks()); 
        }
    }, [projectStatus, dispatch]);

    const handleDeleteProject = (id) => {
        dispatch(deleteProject(id)); 
    };

    const handleEditProject = (project) => {
        setEditProjectId(project.id); 
        setEditProjectName(project.name); 
    };

    const handleUpdateProject = (id) => {
        dispatch(updateProject({ id, name: editProjectName })); 
        setEditProjectId(null); 
    };

    const handleAddTask = (projectId) => {
        if (newTask.trim()) {
            dispatch(addTask({ name: newTask, is_completed: newTaskCompleted, project: projectId }));
            setNewTask(''); 
            setNewTaskCompleted(false); 
            setAddTaskForProject(null); 
        }
    };

    const handleEditTask = (task) => {
        setEditTaskId(task.id); 
        setEditTaskName(task.name); 
        setEditTaskCompleted(task.is_completed); 
    };

    const handleUpdateTask = (taskId,projectId) => {
        // Debugging: log current task details before updating
        console.log('Updating task:', {
            id: taskId,
            name: editTaskName,
            is_completed: editTaskCompleted
        });
    
        if (editTaskName.trim()) {
            dispatch(updateTask({ id: taskId, name: editTaskName, is_completed: editTaskCompleted, project: projectId }));
            setEditTaskId(null);
            setEditTaskName('');
            setEditTaskCompleted(false);
        } else {
            console.error('Task name is empty, cannot update.'); // Handle empty name case
        }
    };

    const handleDeleteTask = (taskId) => {
        dispatch(deleteTask(taskId)); 
    };

    const getProjectTasks = (projectId) => {
        return tasks.filter((task) => task.project === projectId); 
    };

    let content;

    if (projectStatus === 'loading') {
        content = <div>Loading...</div>;
    } else if (projectStatus === 'succeeded') {
        content = projects.map((project) => (
            <li key={project.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                    {editProjectId === project.id ? (
                        <>
                            <input
                                type="text"
                                value={editProjectName}
                                onChange={(e) => setEditProjectName(e.target.value)} 
                                className="form-control"
                            />
                            <button
                                className="btn btn-success btn-sm ml-2"
                                onClick={() => handleUpdateProject(project.id)} 
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            {project.name}
                            <div>
                                <button
                                    className="btn btn-primary btn-sm mr-2"
                                    onClick={() => handleEditProject(project)} 
                                >
                                    Update
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteProject(project.id)} 
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setAddTaskForProject(addTaskForProject === project.id ? null : project.id)} 
                                >
                                    {addTaskForProject === project.id ? "Cancel Task" : "Add Task"}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Add Task Input Field */}
                {addTaskForProject === project.id && (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)} 
                            className="form-control"
                            placeholder="Enter task name"
                        />
                        <div className="form-check mt-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`completed-${project.id}`}
                                checked={newTaskCompleted}
                                onChange={(e) => setNewTaskCompleted(e.target.checked)} 
                            />
                            <label className="form-check-label" htmlFor={`completed-${project.id}`}>
                                Completed
                            </label>
                        </div>
                        <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={() => handleAddTask(project.id)} 
                        >
                            Add Task
                        </button>
                    </div>
                )}

                {/* Display associated tasks under each project */}
                <ul className="list-group mt-2">
                    {getProjectTasks(project.id).map((task) => (
                        <li key={task.id} className="list-group-item">
                            {editTaskId === task.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editTaskName}
                                        onChange={(e) => setEditTaskName(e.target.value)} 
                                        className="form-control"
                                    />
                                    <label className="form-check-label ml-2">
                                        <input
                                            type="checkbox"
                                            checked={editTaskCompleted}
                                            onChange={(e) => setEditTaskCompleted(e.target.checked)} 
                                        /> Completed
                                    </label>
                                    <button
                                        className="btn btn-success btn-sm ml-2"
                                        onClick={() => handleUpdateTask(task.id,task.project)} 
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm ml-2"
                                        onClick={() => setEditTaskId(null)} // Cancel editing
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    {task.name} {task.is_completed ? "(Completed)" : "(Incomplete)"}
                                    <div>
                                        <button
                                            className="btn btn-primary btn-sm mr-2"
                                            onClick={() => handleEditTask(task)} 
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteTask(task.id)} 
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </li>
        ));
    } else if (projectStatus === 'failed') {
        content = <div>{error}</div>;
    }

    return (
        <div className="container">
            <h2>Project List</h2>
            <AddProject /> 
            <ul className="list-group">{content}</ul>
        </div>
    );
};

export default ProjectList;
