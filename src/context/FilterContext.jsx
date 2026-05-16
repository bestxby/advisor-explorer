import { FilterContext } from './filterContextValue';

export function FilterProvider({ value, children }) {
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
