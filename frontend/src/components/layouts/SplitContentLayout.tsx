import React from 'react';

interface FeatureItem {
    icon: React.ElementType;
    title: string;
    description: string;
}

interface SplitContentLayoutProps {
    heading: string;
    features: FeatureItem[];
    imageUrl?: string;
    reverse?: boolean;
    variant?: 'default' | 'hero';
    badgeText?: string;
}

export const SplitContentLayout = ({
    heading,
    features,
    imageUrl,
    reverse = false,
    variant = 'default',
    badgeText
}: SplitContentLayoutProps) => {
    const isHero = variant === 'hero';
    return (
        <div
            className={`w-full max-w-6xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center px-6 py-8 ${
                isHero ? 'relative overflow-hidden' : ''
            }`}
        >
            {isHero && (
                <>
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-tr from-banking-green/30 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-banking-green/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.03] to-white/0" />
                </>
            )}

            {/* Content Side */}
            <div className="flex-1 space-y-8 relative z-10">
                {badgeText && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 text-sm font-medium mb-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-banking-green animate-pulse" />
                        {badgeText}
                    </div>
                )}

                <h2
                    className={`text-4xl lg:text-5xl font-display font-bold tracking-tight mb-8 relative inline-block ${
                        isHero
                            ? 'glossy-sweep'
                            : 'text-white'
                    }`}
                >
                    {heading}
                    <div
                        className={`absolute -bottom-3 left-0 h-1 rounded-full ${
                            isHero
                                ? 'w-2/3 bg-gradient-to-r from-banking-green via-cyan-300 to-teal-300'
                                : 'w-1/3 bg-gradient-to-r from-purple-400 to-teal-400'
                        }`}
                    />
                </h2>

                <div className="space-y-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-white/20 transition-all duration-500">
                                <feature.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg lg:text-xl font-medium text-white/90 mb-1">{feature.title}</h3>
                                <p className="text-white/60 text-sm lg:text-base leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Visual Side - Smartphone Mockup */}
            {imageUrl && (
                <div className="flex-1 flex items-center justify-center w-full">
                    <div className="relative w-72 lg:w-80">
                        {/* Phone notch and frame */}
                        <div className="bg-black rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900 relative" style={{ aspectRatio: '9 / 19.5' }}>
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-50"></div>
                            
                            {/* Screen content */}
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt="Phone wallpaper"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Gloss overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                        </div>
                        
                        {/* Shadow glow */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-[3rem] blur-2xl -z-10"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
