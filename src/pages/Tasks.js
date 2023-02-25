import { useState, useEffect } from "react";
import Axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Typography, Container, Box, Button, List, ListItem, ListItemText, IconButton, TextField, Tooltip  } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//styles for textfields
const field = {
    background: 'rgba(0,0,0,0.2)',
    mx: 'auto',
    mb: 2,
    width: '100%',
    "& .MuiInputBase-root": {color: '#fefefe'},
    "& .MuiOutlinedInput-root": {
        "& > fieldset": { border: "none"},
    },
    "& .MuiOutlinedInput-root:hover": {
        "& > fieldset": { borderLeft: "4px solid #e0e0e0" },
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
        "& > fieldset": {
            border: "2px solid #fefefe"
        }
    },
};

// style for complete, edit, save, cancel and delete buttons
const btn = {
    '&:hover': {
        bgcolor: '#b0bec5',
        color: '#212121'
    },
    color: '#e0e0e0',
    maxHeight: '44px',
    my: 'auto',
    p: 0.5,
};


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
        <Container maxWidth="sm">

            <Typography align="center" color='primary' sx={{my: 2, mx: 'auto', fontSize: {xxs: '24px', xs: '30px', sm: '36px'}}}>
                Todo List
            </Typography>
            
            <Box>
                <TextField
                    onChange={e => setSearchTask(e.target.value)}
                    placeholder='Search task...'
                    value={searchTask}
                    multiline
                    maxRows={2}
                    size='small'
                    variant='outlined' 
                    sx={field}
                />
                    <Box sx={{display: 'flex'}}>
                        <TextField
                            onChange={e => setNewTask(e.target.value)}
                            placeholder='Add tasks...'
                            value={newTask}
                            multiline
                            maxRows={2}
                            size='small'
                            variant='outlined'
                            sx={field}
                        />
                        <Button 
                            sx={{
                                width: '20%', height: {xxs: '30px', xs:'10%'}, fontSize: '100%', ml: 1, my: {xxs: 0.5, xs: 0} , '&:hover': { backgroundColor: '#424242', color: '#fefefe',
                            }}} 
                            onClick={addTask} 
                            variant="contained" 
                            endIcon={<AddCircleOutlineIcon/>}>
                            Add
                        </Button>
                    </Box>
            </Box>
                        
            <Box sx={{
                display: 'flex', 
                flexDirection: {xxs: 'column', sm: 'row'}, 
                gap: {xxs: 1, sm: 5}, 
                mb: 1,
                mx: 'auto', 
                justifyContent: 'center',
                bgcolor: '#cfd8dc', 
                p: 1, 
                borderRadius: 2,
                width: {xxs: '75%', xs: '70%', sm: '95%'},
                }}>
                <Button
                    sx={{
                        '&:hover': { bgcolor: '#424242', color: '#fefefe' },
                        bgcolor: selectedTab === 'all' ? '#212121': '#b0bec5',
                        color: selectedTab === 'all' ? '#fefefe' : '#212121',
                        width: '100%',
                        fontSize: {xxs: '80%', xs: '90%', sm: '100%'}
                    }} 
                    onClick={() => setSelectedTab('all')}>All</Button>
                <Button
                    sx={{
                        '&:hover': { backgroundColor: '#424242', color: '#fefefe' },
                        bgcolor: selectedTab === 'ongoing' ? '#212121': '#b0bec5',
                        color: selectedTab === 'ongoing' ? '#fefefe' : '#212121',
                        width: '100%',
                        fontSize: {xxs: '80%', xs: '90%', sm: '100%'}
                    }}
                    onClick={() => setSelectedTab('ongoing')}>Ongoing</Button>
                <Button
                    sx={{
                        '&:hover': { backgroundColor: '#424242', color: '#fefefe' },
                        bgcolor: selectedTab === 'completed' ? '#212121': '#b0bec5',
                        color: selectedTab === 'completed' ? '#fefefe' : '#212121',
                        width: '100%',
                        fontSize: {xxs: '80%', xs: '90%', sm: '100%'}
                    }}
                    onClick={() => setSelectedTab('completed')}>Completed</Button>
            </Box>    
            
            <List>
            {filteredTask.length === 0 ? (
                <Typography variant="body1" align="center" color='primary' sx={{my: 2, mx: 'auto', }}>
                    - No task found -
                </Typography>
            ) : (
                filteredTask.map(task => (
                    <ListItem key={task.id}>
                        {editingTask && editingTask.id === task.id ? (
                            <Box sx={{
                                display: 'flex', 
                                }}>
                                <TextField 
                                    value={editingTask.text} 
                                    onChange={handleEditChange} 
                                    size='small' 
                                    multiline 
                                    maxRows={2}
                                    sx={{
                                        width: '400px', 
                                        bgcolor: '#b0bec5',
                                        borderRadius: 2,
                                        "& .MuiInputBase-root": {color: '#212121'},
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { border: "none" },
                                        },
                                    }}
                                />
                                    <IconButton onClick={editTask} sx={btn}>
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={cancelEditTask} sx={btn}>
                                        <CancelIcon />
                                    </IconButton>
                            </Box>
                        ) : (
                            <Box sx={{display: 'flex',  width: '100%'}}>
                                <ListItemText
                                    primary={ <Typography> {task.text} </Typography> }
                                    sx={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: '#fefefe', 
                                        bgcolor: 'rgba(0,0,0,0.2)', 
                                        p: 1, m: 0, gap: 0, borderRadius: 2, maxHeight: '44px', 
                                        overflow: 'auto'}}
                                />
                                <Box sx={{display: 'flex'}}>
                                    <Tooltip title="Complete the task?" placement="left-start">
                                        <IconButton onClick={() => completeTask(task)} sx={btn}>
                                            <CheckCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton onClick={() => startEditTask(task)} sx={btn}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => deleteTask(task.id)} sx={btn}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>    
                            </Box>
                        )}
                    </ListItem>
                )))}
                </List>
        </Container>     
    );
}
 
export default Tasks;
