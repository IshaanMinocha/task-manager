import { useState } from 'react';
import TaskItem from './TaskItem';
import type { Task, TaskStatus } from '../../types';

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: TaskStatus) => void;
}

type FilterType = 'all' | 'pending' | 'completed';

const TaskList = ({ tasks, loading, onEdit, onDelete, onToggleStatus }: TaskListProps) => {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return task.status === 'PENDING';
        if (filter === 'completed') return task.status === 'COMPLETED';
        return true;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'PENDING').length,
        completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 border-b-2 border-black">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-bold border-b-4 transition-colors ${filter === 'all'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                        }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 text-sm font-bold border-b-4 transition-colors ${filter === 'pending'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                        }`}
                >
                    Pending ({stats.pending})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 text-sm font-bold border-b-4 transition-colors ${filter === 'completed'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                        }`}
                >
                    Completed ({stats.completed})
                </button>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filter === 'all'
                            ? 'Get started by creating a new task.'
                            : `No ${filter} tasks found.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;

