import { Deck } from '../components/Deck';
import { TitleSlideLayout } from '../components/layouts/TitleSlideLayout';
import { SplitContentLayout } from '../components/layouts/SplitContentLayout';
import { Zap, Shield, Globe } from 'lucide-react';

export const PresentationLanding = () => {
    const slides = [
        (
            // Slide 1 — uses global VideoBackground from App.tsx (lighter overlay for more video visibility)
            <div className="w-full h-full flex flex-col items-center justify-center">
                <TitleSlideLayout
                    title="The Future of Banking"
                    subtitle="Redefining financial experiences through precision, security, and seamless digital innovation."
                    logoUrl="/chamber.png"
                    variant="hero"
                />
            </div>
        ),
        (
            // Slide 2 — Core Philosophies with smartphone mockup
            <div className="w-full h-full flex items-center justify-center px-6 py-12">
                <div className="absolute inset-0 bg-background/40 z-0"></div>
                <div className="absolute inset-0 liquid-sheen z-0 opacity-20"></div>
                <div className="relative z-10 w-full">
                    <SplitContentLayout
                        heading="Foundations of Excellence"
                            variant="hero"
                        features={[
                            { icon: Zap, title: "Seamless Performance", description: "Engineered for speed and stability, delivering uninterrupted banking at every moment." },
                            { icon: Shield, title: "Fortified Security", description: "Advanced encryption and multi-factor authentication safeguarding every transaction with absolute precision." },
                            { icon: Globe, title: "Enduring Infrastructure", description: "Built on resilient, scalable architecture designed to support growth without compromise." },
                        ]}
                        imageUrl="/bank.jpg"
                    />
                </div>
            </div>
        ),
        (
            // Slide 3 — uses global VideoBackground from App.tsx
            <div className="w-full h-full flex flex-col items-center justify-center">
                <TitleSlideLayout
                    title="Welcome To Chamber"
                    subtitle="Securely sign in to manage your finances with precision"
                    variant="hero"
                    titleMarginBottomClassName="mb-8"
                />
            </div>
        )
    ];

    return <Deck slides={slides} />;
};
