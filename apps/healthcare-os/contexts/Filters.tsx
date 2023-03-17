import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'; // prettier-ignore

export interface FiltersInterface {
  [x: string]: any;
}

export const FiltersContext = createContext<{
  filters: Partial<FiltersInterface | undefined>;
  setFilters: Dispatch<SetStateAction<Partial<FiltersInterface | undefined>>>;
}>({
  filters: { page: 0 },
  setFilters: () => null,
});

const FiltersProvider = ({ children }: { children?: ReactNode }) => {
  /**
   * state
   */
  const [filters, setFilters] = useState<Partial<FiltersInterface | undefined>>(
    {}
  );

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
