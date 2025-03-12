import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert,
  AlertTitle,
  Pagination,
  Divider,
  useMediaQuery,
  Paper,
  useTheme,
} from '@mui/material';
import DogCard from '../features/dogs/components/DogCard';
import DogFilter from '../features/dogs/components/DogFilter';
import SortSelector from '../features/dogs/components/SortSelector';
import { fetchDogs, setPage } from '../features/dogs/slice';

const SearchPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { 
    dogs, 
    isLoading, 
    error, 
    total, 
    page, 
    pageSize, 
    filters, 
    sortOption 
  } = useSelector((state) => state.dogs);

  // Fetch dogs on component mount and when search parameters change
  useEffect(() => {
    dispatch(fetchDogs({ 
      filters, 
      page, 
      size: pageSize, 
      sort: sortOption 
    }));
  }, [dispatch, filters, page, pageSize, sortOption]);

  // Handle page change
  const handlePageChange = (event, value) => {
    dispatch(setPage(value - 1)); // API is 0-indexed, UI is 1-indexed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom mt={3}>
        Find Your Perfect Dog
      </Typography>
      
      <Grid container spacing={3}>
        {/* Sidebar with filters */}
        <Grid item xs={12} md={3} lg={3}>
          <DogFilter />
        </Grid>

        {/* Main content with dog cards */}
        <Grid item xs={12} md={9} lg={9}>
          {/* Results header with count and sorting */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2,
              borderRadius: 2
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {isLoading ? (
                'Searching for dogs...'
              ) : error ? (
                'Unable to display results'
              ) : total === 0 ? (
                'No dogs found. Try adjusting your filters.'
              ) : (
                `Found ${total} dog${total !== 1 ? 's' : ''}`
              )}
            </Typography>
            
            <SortSelector />
          </Paper>

          {/* Loading indicator */}
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={10}>
              <CircularProgress />
            </Box>
          ) : null}

          {/* Error message */}
          {error && !isLoading ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          ) : null}

          {/* No results message */}
          {!isLoading && !error && dogs.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>No Dogs Found</AlertTitle>
              Try adjusting your search filters to find dogs.
            </Alert>
          ) : null}

          {/* Dog grid */}
          {!isLoading && !error && dogs.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {dogs.map((dog) => (
                  <Grid item key={dog.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                    <DogCard dog={dog} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '30px 0',
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page + 1} // Convert 0-indexed to 1-indexed for UI
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                  />
                </Box>
              )}
            </>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;