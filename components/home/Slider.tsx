
import React from 'react';
import { SliderImage } from '../../types';
import useSlider from '../../hooks/useSlider';

interface SliderProps {
  images: SliderImage[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const { currentSlide, goToSlide, nextSlide, prevSlide } = useSlider(images.length, 5000);

  if (images.length === 0) {
    return (
      <div className="w-full h-[200px] relative overflow-hidden bg-primary-gradient mb-5 rounded-lg flex justify-center items-center text-white text-2xl font-semibold">
        Welcome to Shuvidha Seva
      </div>
    );
  }

  return (
    <div className="w-full h-[200px] relative overflow-hidden bg-primary-gradient mb-5 rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="min-w-full h-full">
            <img src={img.downloadURL} alt={img.title} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white border-none p-2.5 cursor-pointer z-10 rounded-full left-2.5"
            onClick={prevSlide}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white border-none p-2.5 cursor-pointer z-10 rounded-full right-2.5"
            onClick={nextSlide}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default Slider;
