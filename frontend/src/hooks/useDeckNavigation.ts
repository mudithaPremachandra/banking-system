import { useEffect, useState } from 'react';

interface UseDeckNavigationProps {
    totalSlides: number;
}

export const useDeckNavigation = ({ totalSlides }: UseDeckNavigationProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent default behavior for specific presentation keys to avoid scrolling
            if (['Space', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.code)) {
                e.preventDefault();
            }

            switch (e.code) {
                case 'Space':
                case 'ArrowRight':
                case 'ArrowDown':
                case 'PageDown':
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                case 'Backspace':
                    prevSlide();
                    break;
                case 'Home':
                    setCurrentSlide(0);
                    break;
                case 'End':
                    setCurrentSlide(totalSlides - 1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [totalSlides]);

    return { currentSlide, nextSlide, prevSlide, setCurrentSlide };
};
