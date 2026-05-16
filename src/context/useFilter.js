import { useContext } from 'react';
import { FilterContext } from './filterContextValue';

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be used within FilterProvider');
  return ctx;
}
