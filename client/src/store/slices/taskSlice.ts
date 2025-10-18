import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskState, Task, CreateTaskRequest, UpdateTaskRequest } from '../../types';
import { taskService } from '../../services/taskService';

const initialState: TaskState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await taskService.getTasks();
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.error || 'Failed to fetch tasks');
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch tasks');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: CreateTaskRequest, { rejectWithValue }) => {
        try {
            const response = await taskService.createTask(taskData);
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.error || 'Failed to create task');
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }: { id: string; data: UpdateTaskRequest }, { rejectWithValue }) => {
        try {
            const response = await taskService.updateTask(id, data);
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.error || 'Failed to update task');
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await taskService.deleteTask(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response.error || 'Failed to delete task');
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSelectedTask: (state, action: PayloadAction<Task | null>) => {
            state.selectedTask = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearTasks: (state) => {
            state.tasks = [];
            state.selectedTask = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
                state.error = null;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.unshift(action.payload);
                state.error = null;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
                state.error = null;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
                if (state.selectedTask?.id === action.payload) {
                    state.selectedTask = null;
                }
                state.error = null;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedTask, clearError, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;

