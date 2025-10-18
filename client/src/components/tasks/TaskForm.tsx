import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../../utils/validation';
import type { Task } from '../../types';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (data: TaskFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const TaskForm = ({ task, onSubmit, onCancel, loading = false }: TaskFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            status: task?.status || 'PENDING',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                </label>
                <input
                    {...register('title')}
                    id="title"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
                    placeholder="Enter task title"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    id="description"
                    rows={3}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
                    placeholder="Enter task description (optional)"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    {...register('status')}
                    id="status"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;

