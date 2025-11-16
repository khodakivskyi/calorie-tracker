import {configureStore} from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import {rootEpic} from './epics/rootEpic';
import {rootReducer, type RootState, type RootAction} from './slices/rootReducer';

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({thunk: false}).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;