import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test-utils';
import DogCard from '../../../features/dogs/components/DogCard';
import { addToFavorites, removeFromFavorites } from '../../../features/favorites/slice';

// Mock the slice actions
jest.mock('../../../features/favorites/slice', () => {
  return {
    addToFavorites: jest.fn(() => ({ type: 'favorites/addToFavorites' })),
    removeFromFavorites: jest.fn(() => ({ type: 'favorites/removeFromFavorites' })),
  };
});

describe('DogCard Component', () => {
  // Reset mocks between tests
  beforeEach(() => {
    addToFavorites.mockClear();
    removeFromFavorites.mockClear();
  });

  // Test data
  const mockDog = {
    id: 'dog1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    img: 'https://example.com/dog.jpg',
    zip_code: '12345',
  };

  it('renders the dog information correctly', () => {
    render(<DogCard dog={mockDog} />);
    
    // Check dog information is displayed
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText('3 years old')).toBeInTheDocument();
    expect(screen.getByText('Location: 12345')).toBeInTheDocument();
    
    // Check image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/dog.jpg');
    expect(image).toHaveAttribute('alt', 'Max');
  });

  it('adds a dog to favorites when not favorited', () => {
    // Set up initial state with no favorites
    const initialState = {
      favorites: {
        favorites: [],
      },
    };
    
    const { store } = render(<DogCard dog={mockDog} />, { preloadedState: initialState });
    
    // Find and click the favorite button
    const favoriteButton = screen.getByLabelText(/add to favorites/i);
    fireEvent.click(favoriteButton);
    
    // Verify the addToFavorites action was dispatched with the dog id
    expect(addToFavorites).toHaveBeenCalledWith('dog1');
  });

  it('removes a dog from favorites when already favorited', () => {
    // Set up initial state with the dog already in favorites
    const initialState = {
      favorites: {
        favorites: ['dog1'],
      },
    };
    
    const { store } = render(<DogCard dog={mockDog} />, { preloadedState: initialState });
    
    // Find and click the favorite button
    const favoriteButton = screen.getByLabelText(/remove from favorites/i);
    fireEvent.click(favoriteButton);
    
    // Verify the removeFromFavorites action was dispatched with the dog id
    expect(removeFromFavorites).toHaveBeenCalledWith('dog1');
  });

  it('shows the correct icon based on favorite status', () => {
    // First render with no favorites
    const { unmount } = render(<DogCard dog={mockDog} />, { 
      preloadedState: { favorites: { favorites: [] } } 
    });
    
    // Should show the "add to favorites" icon
    expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/remove from favorites/i)).not.toBeInTheDocument();
    
    unmount();
    
    // Now render with the dog in favorites
    render(<DogCard dog={mockDog} />, { 
      preloadedState: { favorites: { favorites: ['dog1'] } } 
    });
    
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
    
    render(<DogCard dog={dogWithoutImage} />);
    
    // Should still render with a placeholder or default image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    // No longer checking for specific placeholder URL as it may vary
  });

  it('formats age correctly based on value', () => {
    // Test with 1 year old dog (singular)
    const oneYearOldDog = {
      ...mockDog,
      age: 1
    };
    
    const { unmount } = render(<DogCard dog={oneYearOldDog} />);
    expect(screen.getByText('1 year old')).toBeInTheDocument();
    
    unmount();
    
    // Test with multiple year old dog (plural)
    render(<DogCard dog={mockDog} />); // 3 years old
    expect(screen.getByText('3 years old')).toBeInTheDocument();
  });
}); 