import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { searchDogs, getBreeds } from '../features/dogs/slice';
import DogCard from '../features/dogs/components/DogCard';

const SearchPage = () => {
  const dispatch = useDispatch();
  const { dogs, isLoading, error, totalDogs, searchParams } = useSelector((state) => state.dogs);
  const [page, setPage] = useState(1);
  const dogsPerPage = searchParams.size || 25;
  const totalPages = Math.ceil(totalDogs / dogsPerPage);

  // Load dogs on component mount
  useEffect(() => {
    dispatch(getBreeds());
    dispatch(searchDogs(searchParams));
  }, [dispatch, searchParams]);

  const handlePageChange = (event, value) => {
    setPage(value);
    // In a real implementation, this would update the 'from' parameter
    // and re-fetch dogs with the new pagination parameters
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Find Your Perfect Dog
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : dogs.length === 0 ? (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="body1" align="center">
            No dogs found. Try adjusting your search criteria.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {dogs.map((dog) => (
              <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
                <DogCard dog={dog} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4} mb={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchPage; 