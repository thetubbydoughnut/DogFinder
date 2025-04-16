import React from 'react';
import { Grid } from '@mui/material';
import DogCardSkeleton from '../features/dogs/components/DogCardSkeleton';

/**
 * Calculates the number of columns for the grid based on screen size flags.
 * @param {boolean} isMobile - True if screen is mobile size.
 * @param {boolean} isTablet - True if screen is tablet size.
 * @param {boolean} isDesktop - True if screen is desktop size.
 * @returns {number} The number of columns.
 */
export const getColumnCount = (isMobile, isTablet, isDesktop) => {
  if (isMobile) return 1;
  if (isTablet) return 2;
  // Removed lg check - assume 3 columns for md and up unless isDesktop specifies differently?
  // Check breakpoint logic - adjust if needed
  // If isDesktop corresponds to 'lg' and up, this logic might need refinement.
  // Assuming md->lg is 3, xl+ is 4 for now. Revisit if breakpoints differ.
  if (isDesktop) return 4; // Let's assume isDesktop means 'lg' or wider, mapping to 4 cols
  return 3; // Default for medium screens (md)
};

/**
 * Renders a grid of skeleton placeholders for loading states.
 * @param {number} columnCount - The number of columns to determine skeleton layout.
 * @returns {React.ReactNode} A Grid container with DogCardSkeleton components.
 */
export const renderSkeletons = (columnCount) => {
  // Show skeletons based on column count, e.g., 2 rows worth
  const skeletonCount = columnCount * 2;
  
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(skeletonCount)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
          {/* Adjust grid sizing (xs, sm, md, lg) based on expected column count behavior */} 
          <DogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}; 