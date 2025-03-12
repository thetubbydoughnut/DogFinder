import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { setSortOption } from '../slice';

const SortSelector = () => {
  const dispatch = useDispatch();
  const { sortOption } = useSelector((state) => state.dogs);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sort options with descriptive labels and values for API
  const sortOptions = [
    { value: 'breed:asc', label: 'Breed (A-Z) • Default' },
    { value: 'breed:desc', label: 'Breed (Z-A)' },
    { value: 'age:asc', label: 'Age (Youngest)' },
    { value: 'age:desc', label: 'Age (Oldest)' },
    { value: 'name:asc', label: 'Name (A-Z)' },
    { value: 'name:desc', label: 'Name (Z-A)' },
  ];

  // Set default sort option if none is selected
  useEffect(() => {
    if (!sortOption) {
      dispatch(setSortOption('breed:asc'));
    }
  }, [dispatch, sortOption]);

  const handleSortChange = (event) => {
    dispatch(setSortOption(event.target.value));
  };

  // Set default sort to breed:asc if empty
  const currentSortOption = sortOption || 'breed:asc';

  return (
    <Box display="flex" alignItems="center">
      {!isMobile && (
        <Box display="flex" alignItems="center" mr={2}>
          <SortIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Sort by:
          </Typography>
        </Box>
      )}
      
      <FormControl 
        variant="outlined" 
        size="small" 
        sx={{ 
          minWidth: isMobile ? 130 : 180,
        }}
      >
        {isMobile ? (
          <InputLabel id="sort-select-label" sx={{ display: 'flex', alignItems: 'center' }}>
            <SortIcon fontSize="small" sx={{ mr: 0.5 }} /> Sort
          </InputLabel>
        ) : (
          <InputLabel id="sort-select-label">Sort</InputLabel>
        )}
        
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={currentSortOption}
          onChange={handleSortChange}
          label={isMobile ? "Sort" : "Sort"}
          displayEmpty
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortSelector; 