import React, { useRef, useEffect } from 'react';
import { useDeckNavigation } from '../hooks/useDeckNavigation';
import { Slide } from './Slide';

interface DeckProps {
    slides: React.ReactNode[];
}

export const Deck = ({ slides }: DeckProps) => {
    const { currentSlide } = useDeckNavigation({ totalSlides: slides.length });
    const prevSlideRef = useRef(currentSlide);

    useEffect(() => {
        prevSlideRef.current = currentSlide;
    }, [currentSlide]);

    const direction = currentSlide > prevSlideRef.current ? 1 : -1;

    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            {slides.map((slideContent, index) => (
                <Slide
                    key={index}
                    isActive={index === currentSlide}
                    direction={direction}
                >
                    {slideContent}
                </Slide>
            ))}

            {/* Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50 glass-dark px-6 py-3 rounded-full border-t border-white/20">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === currentSlide
                            ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                            : 'w-2 bg-white/20'
                            }`}
                    />
                ))}
            </div>

            {/* Slide Counter Overlay */}
            <div className="absolute bottom-8 right-12 z-50 text-white/30 font-mono text-sm tracking-widest font-medium">
                {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
        </div>
    );
};
