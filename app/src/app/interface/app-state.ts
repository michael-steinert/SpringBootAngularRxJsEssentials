import { DataState } from '../enumeration/data-state.enum';

export interface AppState<T> {
  /* Possible App State: LOADING, LOADED and ERROR */
  dataState: DataState;
  appData?: T;
  error?: string;
}
