import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters as setDogFiltersAction, clearFilters as clearDogFiltersAction } from '../features/dogs/slice';

const useDogFilters = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state) => state.dogs.filters);

  // Function to update filters
  const setFilters = useCallback((newFilters) => {
    dispatch(setDogFiltersAction(newFilters));
  }, [dispatch]);

  // Function to reset filters to default
  const resetFilters = useCallback(() => {
    dispatch(clearDogFiltersAction());
  }, [dispatch]);

  return {
    filters: currentFilters,
    setFilters,
    resetFilters,
  };
};

export default useDogFilters; 