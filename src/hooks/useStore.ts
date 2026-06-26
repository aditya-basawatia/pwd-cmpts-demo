import { useEffect, useState } from 'react';
import { getState, subscribe } from '@/store/store';
import type { AppState } from '@/types';

export function useStore(): AppState {
  const [state, setState] = useState(getState);
  useEffect(() => subscribe(() => setState(getState())), []);
  return state;
}
