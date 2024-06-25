import { useMemo, useState,useEffect } from 'react';
import CustomCard from './Card';
import styles from './ToDo.module.css';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/MenuRounded';
import { FaListCheck } from "react-icons/fa6";
import { TbCheckbox } from "react-icons/tb";
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { CSS } from '@dnd-kit/utilities';
function ToDo({ status, updatedTasks, tasks, cancelTask,draggedTask,searchTerm }) {
    const [activeTask, setActiveTask] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    useEffect(() => {
        if (searchTerm) {
            const filtered = tasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())||task.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTasks(filtered);
        } else {
            setFilteredTasks(tasks);
        }
    }, [searchTerm, tasks]);
    const handleViewTask = (task) => {
        setActiveTask(task);
        /*if (task != null) {
            *//*navigate('/taskID=' + task.ID);*//*
            setActiveTask(null);
        }*/
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: status.toString(), data: { type: 'task', tasks } });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    const tasksIDs = useMemo(() => filteredTasks.map(task => task.id), [filteredTasks])
    if (isDragging) {
        return (<div ref={setNodeRef} style={{ ...style, border: "2px red" }} className={styles.column} ></div>)
    }
    /*console.log(style);*/
    return (
        <div ref={setNodeRef} style={style} className={styles.column}>
            <div className={styles.header} {...attributes} {...listeners }>
                {status == 0 && <MenuIcon sx={{ fontSize: 35, color: "#8E7AD2", padding: "3px", marginLeft: "10px", marginRight: "5px" }} />}
                {status == 1 && <FaListCheck style={{ fontSize: 40, color: "#FE913E", padding: "5px", marginLeft: "10px", marginRight: "7px" }} />}
                {status == 2 && <TbCheckbox style={{ fontSize: 40, color: "#39AC95", padding: "3px", marginLeft: "10px", marginRight: "5px" }} />}
                <h2 className={styles.headerTitle}>{status == 0 ? "To Do" : (status == 1 ? "Doing" : "Done")}</h2>
            </div>
            {filteredTasks && filteredTasks.length > 0 && (
                <div className={styles.tasksContainer}>
                    <SortableContext items={tasksIDs }>
                        {
                            filteredTasks.map(
                                task => (
                                    <CustomCard key={task.id} cancelTask={cancelTask} currTask={task} handleEditTask={handleViewTask} selectedTask={activeTask} updatedTasks={updatedTasks} list={tasks} id={status} isNew={task.id == "new" ? true : false} allowEdit={true} searchKeyword={searchTerm}></CustomCard>
                                )
                            )
                        }
                    </SortableContext>
                </div>
            )}
        </div>
    );
}

export default ToDo;
