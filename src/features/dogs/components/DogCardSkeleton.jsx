import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';

const DogCardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: theme.shadows[2],
      }}
    >
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={200} 
        animation="wave"
        sx={{
          bgcolor: `${theme.palette.primary.main}10`, 
          transform: 'none'
        }}
      />
      
      {/* Content skeleton */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Name skeleton */}
        <Skeleton
          variant="text"
          width="70%"
          height={32}
          animation="wave"
          sx={{ mb: 1, bgcolor: `${theme.palette.primary.main}15`, transform: 'none' }}
        />
        
        {/* Tag skeletons */}
        <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
          <Skeleton
            variant="rounded"
            width={100}
            height={24}
            animation="wave"
            sx={{ borderRadius: 3, bgcolor: `${theme.palette.primary.main}10`, transform: 'none' }}
          />
          <Skeleton
            variant="rounded"
            width={80}
            height={24}
            animation="wave"
            sx={{ borderRadius: 3, bgcolor: `${theme.palette.primary.main}10`, transform: 'none' }}
          />
        </Box>
        
        {/* Location skeleton */}
        <Skeleton
          variant="text"
          width="40%"
          height={24}
          animation="wave"
          sx={{ bgcolor: `${theme.palette.primary.main}10`, transform: 'none' }}
        />
      </CardContent>
      
      {/* Actions skeleton */}
      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton
          variant="rounded"
          width={90}
          height={32}
          animation="wave"
          sx={{ borderRadius: 2, bgcolor: `${theme.palette.primary.main}10`, transform: 'none' }}
        />
        <Skeleton
          variant="rounded"
          width={90}
          height={32}
          animation="wave"
          sx={{ borderRadius: 2, bgcolor: `${theme.palette.primary.main}10`, transform: 'none' }}
        />
      </Box>
    </Card>
  );
};

export default DogCardSkeleton; 