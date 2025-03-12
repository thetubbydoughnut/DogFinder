import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that detects when an element enters the viewport using IntersectionObserver
 * 
 * @param {Object} options - Options for the IntersectionObserver
 * @param {number} options.threshold - Value between 0 and 1 indicating the percentage of the element that needs to be visible
 * @param {string|Element} options.root - Element that is used as the viewport for checking visibility
 * @param {string} options.rootMargin - Margin around the root element
 * @returns {[React.RefObject, boolean]} - Returns a ref to attach to your element and a boolean indicating if visible
 */
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0,
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
    });
    
    const currentElement = elementRef.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.root, options.rootMargin]);
  
  return [elementRef, isVisible];
};

export default useIntersectionObserver; 