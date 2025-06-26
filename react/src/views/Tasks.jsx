import { useState, useEffect } from "react";
import axiosClient from "../api/axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { deleteTask, getTasks, updateTask } from "../services/TaskService.js";
import { getStatuses } from "../services/StatusService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        id: '',
        title: '',
        status: null,
    });

    useEffect(() => {
        fetchTasks();
        fetchStatuses();
    }, []);

    const fetchTasks = (page = 1, customFilters = filters) => {
        setLoading(true);
        getTasks({ page, ...customFilters }, ['status'], [])
            .then(({ data }) => {
                setTasks(data.tasks.data);
                setPagination({
                    currentPage: data.tasks.current_page,
                    lastPage: data.tasks.last_page,
                    perPage: data.tasks.per_page,
                    total: data.tasks.total,
                });
            })
            .finally(() => setLoading(false));
    };

    const fetchStatuses = () => {
        setLoading(true);
        getStatuses({}, [], [])
            .then(({ data }) => {
                console.log(data);
                
                setStatuses(data.statuses);
            })
            .finally(() => setLoading(false));
    };

    const onDelete = (task) => {
        if (window.confirm('Tem certeza que deseja excluir essa tarefa?')) {
            deleteTask(task.id).then(() => {
                setNotification('Tarefa excluída com sucesso!');
                fetchTasks();
            });
        }
    };

    const onComplete = (task) => {
        if (window.confirm('Deseja concluir a tarefa?')) {
            updateTask(task.id, {
                ... task,
                completed_at: new Date(),
                status_id: 2
            }).then(() => {
                setNotification('Tarefa concluída com sucesso!');
                fetchTasks();
            });
        }
    };

    const handleFilterClick = () => {
        setShowFilter(prev => !prev);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Tarefas</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        onClick={handleFilterClick}
                        className="btn-filter"
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#555')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#444')}
                    >
                        <FontAwesomeIcon icon={faFilter} size="lg" />
                    </div>
                    <Link to="/tasks/new" className="btn-add">Criar Nova</Link>
                </div>
            </div>
            {showFilter && (
                <div className="card animated fadeInDown filters" style={{ marginBottom: '1rem' }}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        fetchTasks(1);
                    }} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div>
                            <label htmlFor="filter-id">ID:</label>
                            <input
                                id="filter-id"
                                type="text"
                                value={filters.id}
                                onChange={e => setFilters({ ...filters, id: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="filter-title">Título contém:</label>
                            <input
                                id="filter-title"
                                type="text"
                                value={filters.title}
                                onChange={e => setFilters({ ...filters, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="filter-status">Status:</label>
                            <select
                                id="filter-status"
                                value={filters.status || ''}
                                onChange={e => setFilters({ ...filters, status: e.target.value || null })}
                            >
                                <option value="">Todos</option>
                                {statuses.map(status => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn">Filtrar</button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                const cleared = { id: '', title: '', status: null };
                                setFilters(cleared);
                                fetchTasks(1, cleared);
                            }}
                        >
                            Limpar
                        </button>
                    </form>
                </div>
            )}
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Data de Criação</th>
                            <th></th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center common-text">
                                    <span>Carregando...</span>
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {tasks.map(task => {
                                return (
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.title.substring(0, 40) + (task.title.length > 40 ? '...' : '')}</td>
                                        <td title={task.description}>{task.description ? task.description.substring(0, 40) + (task.description.length > 40 ? '...' : '') : '--'}</td>
                                        <td>
                                            <div className="badge" style={{ backgroundColor: task.status.color }}>{task.status.name}</div>
                                            {task.completed_at && (
                                                <div className="completion-date">
                                                    {new Date(task.completed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                            )}
                                        </td>
                                        <td>{new Date(task.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                                <button onClick={ev => onComplete(task)} className="btn-success">Concluir</button>
                                                &nbsp;
                                                <Link to={`/tasks/${task.id}`} className="btn-edit">Editar</Link>
                                                &nbsp;
                                                <button onClick={ev => onDelete(task)} className="btn-delete">Excluir</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    }
                    {!tasks.length && !loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center common-text">
                                    <span>Nenhuma tarefa encontrada.</span>
                                </td>
                            </tr>
                        </tbody>
                    }
                </table>
            </div>
            <div className="pagination mt-3 flex justify-center text-center">
                <button onClick={() => fetchTasks(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="page-arrows">&laquo;</button>
                <button onClick={() => fetchTasks(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="page-arrows">&raquo;</button>
            </div>
        </div>
    );
}