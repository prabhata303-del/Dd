
import { useState, useEffect, useCallback } from 'react';

const usePdpSlider = (totalSlides: number, intervalTime: number = 2000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pdpAutoScrollInterval, setPdpAutoScrollInterval] = useState<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const startAutoScroll = useCallback(() => {
    if (totalSlides <= 1) return;
    if (pdpAutoScrollInterval) clearInterval(pdpAutoScrollInterval);

    const id = window.setInterval(nextSlide, intervalTime);
    setPdpAutoScrollInterval(id);
  }, [totalSlides, nextSlide, intervalTime, pdpAutoScrollInterval]);

  const stopAutoScroll = useCallback(() => {
    if (pdpAutoScrollInterval) {
      clearInterval(pdpAutoScrollInterval);
      setPdpAutoScrollInterval(null);
    }
  }, [pdpAutoScrollInterval]);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll(); // Cleanup on unmount or slide change
  }, [totalSlides, intervalTime, startAutoScroll, stopAutoScroll]); // Dependencies for effect

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    startAutoScroll,
    stopAutoScroll,
  };
};

export default usePdpSlider;
