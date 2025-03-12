import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { 
  Box, 
  Typography, 
  Autocomplete, 
  TextField, 
  Slider, 
  Button, 
  Paper, 
  Grid,
  InputAdornment,
  FormControl,
  FormLabel,
  Divider,
  Chip,
  IconButton,
  Collapse,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { setFilters, clearFilters } from '../slice';
import dogService from '../../../services/dogService';

// Helper function to format age display
const formatAge = (age) => {
  if (age < 12) {
    return `${age} month${age !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(age / 12);
  const months = age % 12;
  return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? ` ${months} month${months !== 1 ? 's' : ''}` : ''}`;
};

const DogFilter = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.dogs);
  
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState(filters.breeds || []);
  const [ageRange, setAgeRange] = useState(filters.ageRange || [0, 192]); // 0 to 16 years in months
  const [zipCode, setZipCode] = useState(filters.zipCode || '');
  const [zipCodeError, setZipCodeError] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Create debounced filter change handler
  const debouncedFilterChange = useCallback(
    debounce((newFilters) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  // Update this handler to use debouncing
  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  // Fetch breeds on component mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setIsLoading(true);
        const breedsList = await dogService.getBreeds();
        setBreeds(breedsList);
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate zip code if provided
    if (zipCode && !/^\d{5}$/.test(zipCode)) {
      setZipCodeError('Please enter a valid 5-digit ZIP code');
      return;
    }
    
    // Format age range for API (convert from months to days)
    const ageMin = Math.round(ageRange[0] * 30.4375); // ~30.44 days per month
    const ageMax = Math.round(ageRange[1] * 30.4375);
    
    const newFilters = {
      breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
      ageMin: ageRange[0] > 0 ? ageMin : undefined,
      ageMax: ageRange[1] < 192 ? ageMax : undefined,
      zipCodes: zipCode ? [zipCode] : undefined,
    };
    
    dispatch(setFilters(newFilters));
  };

  // Handle reset filters
  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setAgeRange([0, 192]);
    setZipCode('');
    setZipCodeError('');
    dispatch(clearFilters());
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        position: 'sticky',
        top: 80,
        zIndex: 10,
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <FilterListIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Filter Dogs
          </Typography>
        </Box>
        
        <Button
          size="small"
          endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={toggleFilters}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Breed Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    fontWeight: 500
                  }}
                >
                  <PetsIcon fontSize="small" sx={{ mr: 1 }} />
                  Breed
                </FormLabel>
                <Autocomplete
                  multiple
                  id="breed-filter"
                  options={breeds}
                  value={selectedBreeds}
                  onChange={(_, newValue) => setSelectedBreeds(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select breeds"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  loading={isLoading}
                  loadingText="Loading breeds..."
                  sx={{ mb: 1 }}
                />
              </FormControl>
            </Grid>

            {/* Age Range Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    fontWeight: 500
                  }}
                >
                  <TuneIcon fontSize="small" sx={{ mr: 1 }} />
                  Age Range: {formatAge(ageRange[0])} - {formatAge(ageRange[1])}
                </FormLabel>
                <Slider
                  value={ageRange}
                  onChange={(_, newValue) => setAgeRange(newValue)}
                  min={0}
                  max={192} // Up to 16 years in months
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatAge(value)}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 48, label: '4y' },
                    { value: 96, label: '8y' },
                    { value: 144, label: '12y' },
                    { value: 192, label: '16y' },
                  ]}
                />
              </FormControl>
            </Grid>

            {/* ZIP Code Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!zipCodeError}>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    fontWeight: 500
                  }}
                >
                  <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                  ZIP Code
                </FormLabel>
                <TextField
                  id="zip-code-filter"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    setZipCodeError('');
                  }}
                  error={!!zipCodeError}
                  helperText={zipCodeError}
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: zipCode ? (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="clear zip code"
                          onClick={() => setZipCode('')}
                          size="small"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
            >
              Apply Filters
            </Button>
          </Box>
        </form>
      </Collapse>
    </Paper>
  );
};

export default DogFilter; 