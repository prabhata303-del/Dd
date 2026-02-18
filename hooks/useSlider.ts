
import { useState, useEffect, useCallback } from 'react';

const useSlider = (totalSlides: number, intervalTime: number = 3000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideIntervalId, setSlideIntervalId] = useState<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const startAutoSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    if (slideIntervalId) clearInterval(slideIntervalId); // Clear existing interval before starting a new one

    const id = window.setInterval(nextSlide, intervalTime);
    setSlideIntervalId(id);
  }, [totalSlides, nextSlide, intervalTime, slideIntervalId]);

  const stopAutoSlide = useCallback(() => {
    if (slideIntervalId) {
      clearInterval(slideIntervalId);
      setSlideIntervalId(null);
    }
  }, [slideIntervalId]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide(); // Cleanup on unmount
  }, [totalSlides, intervalTime, startAutoSlide, stopAutoSlide]);

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    startAutoSlide,
    stopAutoSlide,
  };
};

export default useSlider;
