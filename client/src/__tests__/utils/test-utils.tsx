import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import authReducer from '../../store/slices/authSlice';
import taskReducer from '../../store/slices/taskSlice';
import { RootState } from '../../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>;
    store?: ReturnType<typeof setupStore>;
}

export function setupStore(preloadedState?: PreloadedState<RootState>) {
    return configureStore({
        reducer: {
            auth: authReducer,
            tasks: taskReducer,
        },
        preloadedState,
    });
}

export function renderWithProviders(
    ui: ReactElement,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <BrowserRouter>{children}</BrowserRouter>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';

