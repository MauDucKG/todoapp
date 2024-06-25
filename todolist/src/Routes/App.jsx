import './App.css';
import ToDo from '../components/ToDo';
import IconButton from '@mui/material/IconButton';
import { FaCircleInfo } from "react-icons/fa6";
import MainHeader from '../components/MainHeader';
import { useMemo, useState, useEffect } from 'react';
import CustomCard from '../components/Card';
import
{
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import handleTokenRefresh from '../Modules/Refresh.js';

function App() {
    const [isInfoShown, setIsInfoShown] = useState(true);
    const [activeTask, setActiveTask] = useState(null);
    function handler() {
        setIsInfoShown(false);
        console.log(isInfoShown);
    }
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        for (let i = 0; i < 3; i++)
            axios.get('https://localhost:7260/api/ToDoList?filterOn=status&filterText=' + i, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                addOrUpdateTask(i, response.data);

            }).catch(error => {
                console.log(error);
                fetchData();
            });
    }, []);
    const fetchData = async () => {
        let b = await handleTokenRefresh();
        if (!b) {
            navigate('/login');
        }
    };
    const [primitiveTasks, setPrimitiveTasks] = useState([
        {
        id: 0,
        content: []
        },
        {
        id: 1,
        content: []
        },
        {
            id: 2,
            content: []
        }
    ]);
    const addOrUpdateTask = (id, content) => {
        setPrimitiveTasks(prevTasks => {
            const existingTaskIndex = prevTasks.findIndex(task => task.id === id);
            if (existingTaskIndex !== -1) {
                const updatedTasks = [...prevTasks];
                updatedTasks[existingTaskIndex] = { id, content };
                return updatedTasks;
            } else {
                return [...prevTasks, { id, content }];
            }
        });
    };
    function addTask(task) {
        setPrimitiveTasks(prevTasks => {
            const updatedTasks = [...prevTasks];
            const index = updatedTasks.findIndex(x => x.id == 0);
            if (updatedTasks[index].content.find(x => x.id == task.id))
                return prevTasks;
            let updatedContent = [];
            if (updatedTasks[index].content.length > 0)
                updatedContent = [task, ...updatedTasks[index].content];
            else
                updatedContent = [task];

            updatedTasks[index] = { id: 0, content: updatedContent };
            return updatedTasks;
        });
    }

    function handleCancelNew(id, task) {
        setPrimitiveTasks((prevTasks) => {
            const updatedTasks = [...prevTasks];
            const index = updatedTasks.findIndex((x) => x.id === id);

            if (index !== -1) { // Check if object with matching id is found
                const updatedContent = updatedTasks[index].content.filter((item) => item.id !== task.id);
                updatedTasks[index].content = updatedContent;
            }

            return updatedTasks;
        });
    }
    const [searchTerm, setSearchTerm] = useState('');
    function handleKeywordSearch(keyword) {
        setSearchTerm(keyword);
    }

    const getContentById = (id) => {
        const task = primitiveTasks.find(task => task.id == id);
        const content=task.content;
        return content;
    };

    const [activeColumn, setActiveColumn] = useState(null);
    function onDragStart(event) {
        console.log(event);
        if (event.active.data.current?.type === 'task') {
            setActiveColumn(event.active.id);
        } else {
            setActiveColumn(null);
        }
        if (event.active.data.current?.type === 'singleTask') {
            setActiveTask(event.active.data.current.task);
        } else {
            setActiveTask(null);
        }
    }
    function onDragEnd(event) {
        const { active, over } = event;
        if (!over)
            return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId)
            return;
        if (active.data.current?.type === 'task' && over.data.current?.type=='task')  
            setPrimitiveTasks(prevTasks =>
            {
                const activeIndex = prevTasks.findIndex(task => task.id == activeId);
                const overIndex = prevTasks.findIndex(task => task.id == overId);
                return arrayMove(prevTasks,activeIndex,overIndex);
            });
        if (active.data.current?.type === 'singleTask')
            setPrimitiveTasks(prevTasks => {
                const updatedTasks = [...prevTasks];
                const activeIndex = updatedTasks.findIndex(task => task.id == active.data.current.task.status);
                const id = over.data.current?.type === 'singleTask' ? over.data.current.task.status : over.id;
                const overIndex = updatedTasks.findIndex(task => task.id == id);
                if (overIndex === activeIndex ){
                    const index = updatedTasks[activeIndex].content.findIndex(x => x.id == active.id);
                    const overActiveColumnIndex = updatedTasks[activeIndex].content.findIndex(x => x.id == over.id);
                    if (overActiveColumnIndex == -1)
                        return prevTasks;
                    const updatedActiveContent = arrayMove(updatedTasks[activeIndex].content, overActiveColumnIndex, index);
                    updatedTasks[activeIndex].content = updatedActiveContent;
                    return updatedTasks;
                }
                else if (activeIndex !== -1) { // Check if object with matching id is found
                    const updatedActiveContent = updatedTasks[activeIndex].content.filter((item) => item.id !== active.id);
                    const updatedTaskWithNewStatus = {
                        ...active.data.current.task,
                        status: overIndex,
                    };
                    const { id, ...taskWithoutId } = updatedTaskWithNewStatus;
                    axios.put('https://localhost:7260/api/ToDoList/' + updatedTaskWithNewStatus.id, taskWithoutId, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).then(response => {
                        console.log(response.status);
                        console.log(response.data);
                    }).catch(error => { handleTokenRefresh() });
                    const updatedOverContent = [updatedTaskWithNewStatus,...updatedTasks[overIndex].content];
                    updatedTasks[activeIndex].content = updatedActiveContent;
                    updatedTasks[overIndex].content = updatedOverContent;
                    return updatedTasks;
                }
            });
    }
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    const columnsIDs = useMemo(() => primitiveTasks.map((t) => t.id.toString()), [primitiveTasks]);

    return (
        <>
            <MainHeader handleInfoClose={handler} isInfoShown={isInfoShown} addTask={addTask} setSearchTerm={ handleKeywordSearch} />
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd }>
                <div style={{ top: isInfoShown ? "15vh" : "8vh", position: 'fixed', width: '100%', zIndex: '-1', height: '2.08vh', backgroundColor: "rgb(244, 247, 252)" }}></div>
                <main style={{ marginTop: isInfoShown ? "15vh" : "8vh" }}>
                    <div className="container">
                        <SortableContext items={columnsIDs}>
                            {primitiveTasks.map((task) => ( 
                                <ToDo key={task.id} status={task.id} updatedTasks={addOrUpdateTask} tasks={getContentById(task.id)} cancelTask={handleCancelNew} searchTerm={searchTerm }></ToDo>))}
                        </SortableContext>
                    </div>
                    <div style={{ position: "fixed", right: 0, zIndex: -1 }} className={"infoDiv" }>
                        {!isInfoShown && <IconButton aria-label="Close" style={{ outline: "none",cursor:"hand" }} onClick={() => setIsInfoShown(true)} >
                            <FaCircleInfo style={{ width: "20px", height: "20px", fill: "url(#lgrad)" }} />
                        </IconButton>}
                    </div>
                    <svg width="0" height="0">
                        <linearGradient id="lgrad" x1="50%" y1="100%" x2="50%" y2="0%" >
                            <stop offset="0%" style={{ direction: "ltr", stopColor: "rgb(57,52,94)", stopOpacity: "1.00" }} />
                            <stop offset="100%" style={{ direction: "ltr", stopColor: "rgb(194,157,222)", stopOpacity: "1.00" }} />
                        </linearGradient>
                    </svg>
                </main>
                {
                    createPortal(
                        <DragOverlay>
                            {activeColumn &&
                                <ToDo status={activeColumn} updatedTasks={addOrUpdateTask} tasks={getContentById(activeColumn)} cancelTask={handleCancelNew}>
                                </ToDo>
                            }
                            {
                                activeTask &&
                                <CustomCard currTask={activeTask} selectedTask={activeTask} updatedTasks={addOrUpdateTask} list={getContentById(activeTask.status)} id={activeTask.status} allowEdit={false}></CustomCard>
                            }
                        </DragOverlay>, document.body)}
            </DndContext>
        </>
    )
}

export default App
