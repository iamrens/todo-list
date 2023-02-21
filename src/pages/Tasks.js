import { useState, useEffect } from "react";
import Axios from 'axios';

const Tasks = () => {

    const [taskList, setTaskList] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingTask, setEditingTask] = useState(null); 
    const [searchTask, setSearchTask] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");

    const filteredTask = taskList
        .filter(task => 
            task.text.toLowerCase().includes(searchTask.toLowerCase()))
        .filter(task => {
            if (selectedTab === 'all') {
                return true;
            }
            return task.completed === (selectedTab === 'completed');
        })

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        Axios.post("http://localhost:8000/todos", {text: newTask, completed: false})
            .then(res => {
                setTaskList([...taskList, res.data]);
                setNewTask("");
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        Axios.get('http://localhost:8000/todos')
          .then(response => {
            setTaskList(response.data);
          })
          .catch(error => {
            console.log(error);
          });
    }, []);

    const completeTask = (task) => {
        const updatedTask = { ...task, completed: !task.completed };
        Axios.put(`http://localhost:8000/todos/${task.id}`, updatedTask)
          .then(() => {
            setTaskList((prevTaskList) =>
              prevTaskList.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
          })
          .catch((error) => console.log(error));
    };

    const deleteTask = id => {
        Axios.delete(`http://localhost:8000/todos/${id}`)
            .then(res => {
                const updatedTask = taskList.filter(task => task.id !== id);
                setTaskList(updatedTask);
            })
            .catch(error => console.log(error));
    };

    const editTask = e => {
        e.preventDefault();
        if (!editingTask || !editingTask.text.trim()) return;
        Axios.put(`http://localhost:8000/todos/${editingTask.id}`, editingTask)
            .then(() => {
                setTaskList(taskList.map((task) => {
                    if (task.id === editingTask.id) {
                        return editingTask;
                    } else {
                        return task;
                    }
                }));
                setEditingTask(null);
            })
            .catch(error => console.log(error));
    };

    const handleEditChange = e => {
        setEditingTask({
            ...editingTask,
            text: e.target.value
        });
    };

    const startEditTask = (task) => {
        setEditingTask(task);
    };

    const cancelEditTask = () => {
        setEditingTask(null);
    };

    return (
        <div>
            <h1>
                Todo List
            </h1>
            
            <div>

                <input onChange={e => setSearchTask(e.target.value)} placeholder='Search task...' value={searchTask}/>

                <form onSubmit={addTask}>
                    <input value={newTask} type="text" placeholder="Tasks..." onChange={e => setNewTask(e.target.value)}/>
                    <button type="submit" onClick={addTask}>Add Task</button>

                </form>
            </div>
            
            <div>
                <button onClick={() => setSelectedTab('all')}>All</button>
                <button onClick={() => setSelectedTab('completed')}>Completed</button>
                <button onClick={() => setSelectedTab('ongoing')}>Ongoing</button>
            </div>
            <div>
                {filteredTask.map(task => (
                <div key={task.id}>
                    {editingTask && editingTask.id === task.id ? (
                        <form onSubmit={editTask}>
                            <input value={editingTask.text} type="text" onChange={handleEditChange}/>
                            <button type="submit">Save</button>
                            <button type="button" onClick={cancelEditTask}>Cancel</button>
                        </form>
                    ) : (
                        <div>
                            <span
                                style={{textDecoration: task.completed ? 'line-through' : ''}}
                            >
                                {task.text}
                            </span>
                            <button onClick={() => completeTask(task)}>Completed?</button>
                            <button onClick={() => startEditTask(task)}>Edit</button>
                            <button onClick={() => deleteTask(task.id)}>Delete</button>
                        </div>
                    )}

                </div>
                ))}
            </div>

        </div>     
    );
}
 
export default Tasks;
