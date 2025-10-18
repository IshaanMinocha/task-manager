import { useState } from 'react';
import type { Task } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: 'PENDING' | 'COMPLETED') => void;
}

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }: TaskItemProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        onDelete(task.id);
        setShowDeleteConfirm(false);
    };

    const handleToggleStatus = () => {
        const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
        onToggleStatus(task.id, newStatus);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow border-4 border-black">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggleStatus}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.status === 'COMPLETED'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-500'
                                }`}
                        >
                            {task.status === 'COMPLETED' && (
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </button>

                        <div className="flex-1">
                            <h3
                                className={`text-lg font-semibold ${task.status === 'COMPLETED'
                                    ? 'text-gray-500 line-through'
                                    : 'text-gray-900'
                                    }`}
                            >
                                {task.title}
                            </h3>
                            {task.description && (
                                <p
                                    className={`mt-1 text-sm ${task.status === 'COMPLETED' ? 'text-gray-400' : 'text-gray-600'
                                        }`}
                                >
                                    {task.description}
                                </p>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatDate(task.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors border-2 border-black"
                        title="Edit task"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors border-2 border-black"
                        title="Delete task"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="mt-3 p-3 bg-white border-2 border-black rounded-lg">
                    <p className="text-sm text-black font-bold mb-2">Are you sure you want to delete this task?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1 text-sm font-bold text-white bg-black border-2 border-black rounded hover:bg-gray-800"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-3 py-1 text-sm font-bold text-black bg-white border-2 border-black rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItem;

