import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SlideProps {
    children: ReactNode;
    isActive: boolean;
    direction?: number;
}

const slideVariants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? '8%' : '-8%',
            opacity: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? '8%' : '-8%',
            opacity: 0,
        };
    }
};

export const Slide = ({ children, isActive, direction = 1 }: SlideProps) => {
    return (
        <AnimatePresence initial={false} custom={direction}>
            {isActive && (
                <motion.div
                    key="slide"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.45 },
                        opacity: { duration: 0.35, ease: 'easeInOut' },
                    }}
                    className="absolute inset-0 flex items-center justify-center p-8 md:p-16 lg:p-24"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
