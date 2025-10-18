import taskReducer, {
    setSelectedTask,
    clearError,
    clearTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../store/slices/taskSlice';
import type { TaskState, Task } from '../types';

jest.mock('../services/taskService');

describe('taskSlice', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const initialState: TaskState = {
        tasks: [],
        selectedTask: null,
        loading: false,
        error: null,
    };

    describe('reducers', () => {
        it('should handle initial state', () => {
            expect(taskReducer(undefined, { type: 'unknown' })).toEqual(initialState);
        });

        it('should handle setSelectedTask', () => {
            const actual = taskReducer(initialState, setSelectedTask(mockTask));
            expect(actual.selectedTask).toEqual(mockTask);
        });

        it('should handle setSelectedTask with null', () => {
            const previousState: TaskState = {
                ...initialState,
                selectedTask: mockTask,
            };
            const actual = taskReducer(previousState, setSelectedTask(null));
            expect(actual.selectedTask).toBeNull();
        });

        it('should handle clearError', () => {
            const previousState: TaskState = {
                ...initialState,
                error: 'Some error',
            };
            const actual = taskReducer(previousState, clearError());
            expect(actual.error).toBeNull();
        });

        it('should handle clearTasks', () => {
            const previousState: TaskState = {
                tasks: [mockTask],
                selectedTask: mockTask,
                loading: false,
                error: 'Some error',
            };
            const actual = taskReducer(previousState, clearTasks());
            expect(actual.tasks).toEqual([]);
            expect(actual.selectedTask).toBeNull();
            expect(actual.error).toBeNull();
        });
    });

    describe('async thunks', () => {
        describe('fetchTasks', () => {
            it('should set loading to true when fetchTasks is pending', () => {
                const action = { type: fetchTasks.pending.type };
                const state = taskReducer(initialState, action);

                expect(state.loading).toBe(true);
                expect(state.error).toBeNull();
            });

            it('should set tasks when fetchTasks is fulfilled', () => {
                const tasks = [mockTask, { ...mockTask, id: '2' }];
                const action = {
                    type: fetchTasks.fulfilled.type,
                    payload: tasks,
                };
                const state = taskReducer(initialState, action);

                expect(state.loading).toBe(false);
                expect(state.tasks).toEqual(tasks);
                expect(state.error).toBeNull();
            });

            it('should set error when fetchTasks is rejected', () => {
                const action = {
                    type: fetchTasks.rejected.type,
                    payload: 'Failed to fetch tasks',
                };
                const state = taskReducer(initialState, action);

                expect(state.loading).toBe(false);
                expect(state.error).toBe('Failed to fetch tasks');
            });
        });

        describe('createTask', () => {
            it('should add temp task when createTask is pending', () => {
                const action = {
                    type: createTask.pending.type,
                    meta: {
                        arg: {
                            title: 'New Task',
                            description: 'New Description',
                            status: 'PENDING',
                        },
                    },
                };
                const state = taskReducer(initialState, action);

                expect(state.tasks).toHaveLength(1);
                expect(state.tasks[0].title).toBe('New Task');
                expect(state.tasks[0].id).toContain('temp-');
                expect(state.error).toBeNull();
            });

            it('should replace temp task when createTask is fulfilled', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [{
                        ...mockTask,
                        id: 'temp-123',
                    }],
                };
                const action = {
                    type: createTask.fulfilled.type,
                    payload: mockTask,
                };
                const state = taskReducer(previousState, action);

                expect(state.tasks).toHaveLength(1);
                expect(state.tasks[0]).toEqual(mockTask);
                expect(state.error).toBeNull();
            });

            it('should remove temp task when createTask is rejected', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [
                        { ...mockTask, id: 'temp-123' },
                        { ...mockTask, id: '2' },
                    ],
                };
                const action = {
                    type: createTask.rejected.type,
                    payload: 'Failed to create task',
                };
                const state = taskReducer(previousState, action);

                expect(state.tasks).toHaveLength(1);
                expect(state.tasks[0].id).toBe('2');
                expect(state.error).toBe('Failed to create task');
            });
        });

        describe('updateTask', () => {
            it('should update task optimistically when updateTask is pending', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [mockTask],
                };
                const action = {
                    type: updateTask.pending.type,
                    meta: {
                        arg: {
                            id: '1',
                            data: { title: 'Updated Title' },
                        },
                    },
                };
                const state = taskReducer(previousState, action);

                expect(state.tasks[0].title).toBe('Updated Title');
                expect(state.error).toBeNull();
            });

            it('should update selectedTask when updating selected task', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [mockTask],
                    selectedTask: mockTask,
                };
                const action = {
                    type: updateTask.pending.type,
                    meta: {
                        arg: {
                            id: '1',
                            data: { title: 'Updated Title' },
                        },
                    },
                };
                const state = taskReducer(previousState, action);

                expect(state.selectedTask?.title).toBe('Updated Title');
            });

            it('should replace with server response when updateTask is fulfilled', () => {
                const updatedTask = { ...mockTask, title: 'Server Updated' };
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [mockTask],
                };
                const action = {
                    type: updateTask.fulfilled.type,
                    payload: updatedTask,
                };
                const state = taskReducer(previousState, action);

                expect(state.tasks[0].title).toBe('Server Updated');
                expect(state.error).toBeNull();
            });

            it('should set error when updateTask is rejected', () => {
                const action = {
                    type: updateTask.rejected.type,
                    payload: 'Failed to update task',
                };
                const state = taskReducer(initialState, action);

                expect(state.error).toBe('Failed to update task');
            });
        });

        describe('deleteTask', () => {
            it('should remove task optimistically when deleteTask is pending', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [mockTask, { ...mockTask, id: '2' }],
                };
                const action = {
                    type: deleteTask.pending.type,
                    meta: { arg: '1' },
                };
                const state = taskReducer(previousState, action);

                expect(state.tasks).toHaveLength(1);
                expect(state.tasks[0].id).toBe('2');
                expect(state.error).toBeNull();
            });

            it('should clear selectedTask when deleting selected task', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [mockTask],
                    selectedTask: mockTask,
                };
                const action = {
                    type: deleteTask.pending.type,
                    meta: { arg: '1' },
                };
                const state = taskReducer(previousState, action);

                expect(state.selectedTask).toBeNull();
            });

            it('should keep state when deleteTask is fulfilled', () => {
                const previousState: TaskState = {
                    ...initialState,
                    tasks: [{ ...mockTask, id: '2' }],
                };
                const action = {
                    type: deleteTask.fulfilled.type,
                    payload: '1',
                };
                const state = taskReducer(previousState, action);

                expect(state.error).toBeNull();
                expect(state.tasks).toEqual(previousState.tasks);
            });

            it('should set error when deleteTask is rejected', () => {
                const action = {
                    type: deleteTask.rejected.type,
                    payload: 'Failed to delete task',
                };
                const state = taskReducer(initialState, action);

                expect(state.error).toBe('Failed to delete task');
            });
        });
    });

    describe('optimistic updates', () => {
        it('should handle create, update, and delete in sequence', () => {
            // Create
            let state = taskReducer(initialState, {
                type: createTask.pending.type,
                meta: { arg: { title: 'Task 1' } },
            });
            expect(state.tasks).toHaveLength(1);

            state = taskReducer(state, {
                type: createTask.fulfilled.type,
                payload: mockTask,
            });
            expect(state.tasks[0]).toEqual(mockTask);

            // Update
            state = taskReducer(state, {
                type: updateTask.pending.type,
                meta: { arg: { id: '1', data: { status: 'COMPLETED' } } },
            });
            expect(state.tasks[0].status).toBe('COMPLETED');

            // Delete
            state = taskReducer(state, {
                type: deleteTask.pending.type,
                meta: { arg: '1' },
            });
            expect(state.tasks).toHaveLength(0);
        });
    });
});

