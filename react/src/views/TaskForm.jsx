import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { getTask } from "../services/TaskService.js";
import { storeTask, updateTask } from '../services/TaskService.js';

export default function TaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext();
    const [task, setTask] = useState({
        id: null,
        title: '',
        description: '',
        status_id: 1,
    });

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getTask(id, {})
            .then(({ data }) => {
                if (data.task) {
                    setTask(data.task);
                } else {
                    setTask(data);
                }
                
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();

        const request = task.id
            ? updateTask(task.id, task)
            : storeTask(task);

        request
            .then(({ data }) => {
                setNotification(
                    task.id
                        ? 'Tarefa atualizada com sucesso!'
                        : 'Tarefa criada com sucesso!'
                );
                navigate('/tasks');
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                } else {
                    setErrors({
                        apiError: ['Ocorreu um erro inesperado :('],
                    });
                    setTimeout(() => {
                        setErrors(null);
                    }, 5000);
                }
            });
    };

    return (
        <div>
            { task.id ? <h1>Editando Tarefa</h1> : <h1>Nova Tarefa</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center common-text">Carregando...</div>}
                { errors && (
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && 
                    <form onSubmit={onSubmit}>
                        <label htmlFor="title" className="mb-1"><strong>Título</strong></label>
                        <input value={task.title} onChange={ev => setTask({...task, title: ev.target.value})} type="text" placeholder="Nome"/>
                        <label htmlFor="description" className="mb-1 mt-3"><strong>Descrição</strong></label>
                        <textarea value={task.description} onChange={ev => setTask({...task, description: ev.target.value})} type="text" placeholder="Descrição"/>
                        <button className="btn mt-4" type="submit">Salvar</button>
                    </form>
                }
            </div>
        </div>
    );
}