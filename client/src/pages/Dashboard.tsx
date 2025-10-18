import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../store/slices/taskSlice';
import Layout from '../components/layout/Layout';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import type { Task, TaskStatus } from '../types';
import type { TaskFormData } from '../utils/validation';

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleCreateTask = async (data: TaskFormData) => {
        await dispatch(createTask(data));
        setIsModalOpen(false);
    };

    const handleUpdateTask = async (data: TaskFormData) => {
        if (selectedTask) {
            await dispatch(updateTask({ id: selectedTask.id, data }));
            setIsModalOpen(false);
            setSelectedTask(null);
        }
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (id: string) => {
        await dispatch(deleteTask(id));
    };

    const handleToggleStatus = async (id: string, status: TaskStatus) => {
        await dispatch(updateTask({ id, data: { status } }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleOpenCreateModal = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const stats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'PENDING').length,
        completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-8 w-8 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-8 w-8 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-8 w-8 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Completed</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
                        <button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add New Task
                        </button>
                    </div>

                    {/* Task List */}
                    <TaskList
                        tasks={tasks}
                        loading={loading}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleStatus={handleToggleStatus}
                    />

                    {/* Task Modal */}
                    <TaskModal
                        isOpen={isModalOpen}
                        task={selectedTask}
                        onClose={handleCloseModal}
                        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
                        loading={loading}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

