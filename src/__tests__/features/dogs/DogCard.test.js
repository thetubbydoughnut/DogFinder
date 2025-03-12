import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import theme from '../../../theme';
import DogCard from '../../../features/dogs/components/DogCard';
import { addToFavorites, removeFromFavorites } from '../../../features/favorites/slice';

// Mock React Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock the slice actions
jest.mock('../../../features/favorites/slice', () => {
  return {
    addToFavorites: jest.fn(() => ({ type: 'favorites/addToFavorites' })),
    removeFromFavorites: jest.fn(() => ({ type: 'favorites/removeFromFavorites' })),
  };
});

// Import the mocked modules to configure them
import { useSelector, useDispatch } from 'react-redux';

describe('DogCard Component', () => {
  // Mock dispatch function
  const mockDispatch = jest.fn();

  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    useSelector.mockClear();
    useDispatch.mockClear();
    mockDispatch.mockClear();
    addToFavorites.mockClear();
    removeFromFavorites.mockClear();
    
    // Setup default mock implementation
    useDispatch.mockReturnValue(mockDispatch);
  });

  // Custom render function for this test file
  const customRender = (ui, { isFavorite = false, ...options } = {}) => {
    // Mock the useSelector hook to return the favorites state
    useSelector.mockImplementation((selector) => {
      // Create a mock state that matches what the component expects
      const mockState = {
        favorites: {
          favorites: isFavorite ? ['dog1'] : [],
        }
      };
      return selector(mockState);
    });

    return render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>,
      options
    );
  };

  // Test data
  const mockDog = {
    id: 'dog1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3 * 365, // 3 years in days
    img: 'https://example.com/dog.jpg',
    zip_code: '12345',
  };

  it('renders the dog information correctly', () => {
    customRender(<DogCard dog={mockDog} />);
    
    // Check dog information is displayed
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText('3 years')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    
    // Check image is rendered using alt text instead of role
    const dogImage = screen.getByAltText(`A photo of ${mockDog.name}, a ${mockDog.breed} dog`);
    expect(dogImage).toBeInTheDocument();
    expect(dogImage).toHaveAttribute('src', mockDog.img);
  });

  it('should add dog to favorites when favorite button is clicked', () => {
    customRender(<DogCard dog={mockDog} />);
    
    // Find and click the favorite button
    const favoriteButton = screen.getByLabelText(/add to favorites/i);
    fireEvent.click(favoriteButton);
    
    // Verify the addToFavorites action was dispatched with the dog id
    expect(addToFavorites).toHaveBeenCalledWith('dog1');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should remove dog from favorites when favorite button is clicked for a dog that is already favorited', () => {
    customRender(<DogCard dog={mockDog} />, { isFavorite: true });
    
    // Find and click the favorite button
    const favoriteButton = screen.getByLabelText(/remove from favorites/i);
    fireEvent.click(favoriteButton);
    
    // Verify the removeFromFavorites action was dispatched with the dog id
    expect(removeFromFavorites).toHaveBeenCalledWith('dog1');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows the correct icon based on favorite status', () => {
    // First render with no favorites
    const { unmount } = customRender(<DogCard dog={mockDog} />, { isFavorite: false });
    
    // Should show the "add to favorites" icon
    expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/remove from favorites/i)).not.toBeInTheDocument();
    
    unmount();
    
    // Now render with the dog in favorites
    customRender(<DogCard dog={mockDog} />, { isFavorite: true });
    
    // Should show the "remove from favorites" icon
    expect(screen.getByLabelText(/remove from favorites/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/add to favorites/i)).not.toBeInTheDocument();
  });

  it('handles missing image gracefully', () => {
    // Dog without an image
    const dogWithoutImage = {
      ...mockDog,
      img: undefined
    };
    
    customRender(<DogCard dog={dogWithoutImage} />);
    
    // Should render a skeleton while loading
    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();

    const dogImage = screen.getByAltText(`A photo of ${dogWithoutImage.name}, a ${dogWithoutImage.breed} dog`);
    expect(dogImage).toBeInTheDocument();
    // Should use fallback URL
    expect(dogImage).toHaveAttribute('src', expect.stringContaining('placedog.net'));
  });

  it('formats age correctly based on value', () => {
    // Test with 1 year old dog (singular)
    const oneYearOldDog = {
      ...mockDog,
      age: 1 * 365 // 1 year in days
    };
    
    const { unmount } = customRender(<DogCard dog={oneYearOldDog} />);
    expect(screen.getByText('1 year')).toBeInTheDocument();
    
    unmount();
    
    // Test with young dog in months
    const youngDog = {
      ...mockDog,
      age: 90 // 3 months in days
    };
    
    customRender(<DogCard dog={youngDog} />);
    expect(screen.getByText('3 months')).toBeInTheDocument();
  });
}); 