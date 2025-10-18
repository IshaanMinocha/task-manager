import { useEffect } from 'react';
import TaskForm from './TaskForm';
import type { Task } from '../../types';
import type { TaskFormData } from '../../utils/validation';

interface TaskModalProps {
    isOpen: boolean;
    task?: Task | null;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
    loading?: boolean;
}

const TaskModal = ({ isOpen, task, onClose, onSubmit, loading = false }: TaskModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                                    {task ? 'Edit Task' : 'Create New Task'}
                                </h3>
                                <TaskForm
                                    task={task}
                                    onSubmit={onSubmit}
                                    onCancel={onClose}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;

