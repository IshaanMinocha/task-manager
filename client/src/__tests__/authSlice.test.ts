import authReducer, { logout, setCredentials, clearError, login, register } from '../store/slices/authSlice';
import type { AuthState } from '../types';

jest.mock('../services/authService');
jest.mock('../utils/auth');

describe('authSlice', () => {
    const initialState: AuthState = {
        user: null,
        token: undefined,
        isAuthenticated: false,
        loading: false,
        error: null,
    };

    describe('reducers', () => {
        it('should handle initial state', () => {
            expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
        });

        it('should handle logout', () => {
            const previousState: AuthState = {
                user: { id: '1', username: 'testuser', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                token: 'test-token',
                isAuthenticated: true,
                loading: false,
                error: null,
            };

            const actual = authReducer(previousState, logout());

            expect(actual.user).toBeNull();
            expect(actual.token).toBeNull();
            expect(actual.isAuthenticated).toBe(false);
            expect(actual.error).toBeNull();
        });

        it('should handle setCredentials', () => {
            const user = { id: '1', username: 'testuser', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            const token = 'test-token';

            const actual = authReducer(initialState, setCredentials({ user, token }));

            expect(actual.user).toEqual(user);
            expect(actual.token).toBe(token);
            expect(actual.isAuthenticated).toBe(true);
        });

        it('should handle clearError', () => {
            const previousState: AuthState = {
                ...initialState,
                error: 'Some error',
            };

            const actual = authReducer(previousState, clearError());

            expect(actual.error).toBeNull();
        });
    });

    describe('async thunks', () => {
        describe('login', () => {
            it('should set loading to true when login is pending', () => {
                const action = { type: login.pending.type };
                const state = authReducer(initialState, action);

                expect(state.loading).toBe(true);
                expect(state.error).toBeNull();
            });

            it('should set user and token when login is fulfilled', () => {
                const user = { id: '1', username: 'testuser', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                const token = 'test-token';
                const action = {
                    type: login.fulfilled.type,
                    payload: { user, token },
                };
                const state = authReducer(initialState, action);

                expect(state.loading).toBe(false);
                expect(state.user).toEqual(user);
                expect(state.token).toBe(token);
                expect(state.isAuthenticated).toBe(true);
                expect(state.error).toBeNull();
            });

            it('should set error when login is rejected', () => {
                const action = {
                    type: login.rejected.type,
                    payload: 'Invalid credentials',
                };
                const state = authReducer(initialState, action);

                expect(state.loading).toBe(false);
                expect(state.error).toBe('Invalid credentials');
                expect(state.user).toBeNull();
                expect(state.token).toBeUndefined();
                expect(state.isAuthenticated).toBe(false);
            });
        });

        describe('register', () => {
            it('should set loading to true when register is pending', () => {
                const action = { type: register.pending.type };
                const state = authReducer(initialState, action);

                expect(state.loading).toBe(true);
                expect(state.error).toBeNull();
            });

            it('should clear error when register is fulfilled', () => {
                const previousState: AuthState = {
                    ...initialState,
                    error: 'Previous error',
                };
                const action = {
                    type: register.fulfilled.type,
                    payload: { id: '1', username: 'testuser' },
                };
                const state = authReducer(previousState, action);

                expect(state.loading).toBe(false);
                expect(state.error).toBeNull();
            });

            it('should set error when register is rejected', () => {
                const action = {
                    type: register.rejected.type,
                    payload: 'Username already exists',
                };
                const state = authReducer(initialState, action);

                expect(state.loading).toBe(false);
                expect(state.error).toBe('Username already exists');
            });
        });
    });

    describe('state persistence', () => {
        it('should maintain user state after logout and setCredentials', () => {
            const user = { id: '1', username: 'testuser', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            const token = 'test-token';

            let state = authReducer(initialState, setCredentials({ user, token }));
            expect(state.isAuthenticated).toBe(true);

            state = authReducer(state, logout());
            expect(state.isAuthenticated).toBe(false);
            expect(state.user).toBeNull();
        });

        it('should clear error before login attempt', () => {
            const previousState: AuthState = {
                ...initialState,
                error: 'Previous error',
            };

            const state = authReducer(previousState, { type: login.pending.type });
            expect(state.error).toBeNull();
        });
    });
});

