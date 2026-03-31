import React from 'react';

interface TitleSlideLayoutProps {
    title: string;
    subtitle?: string;
    icon?: React.ElementType;
    logoUrl?: string;
    titleMarginBottomClassName?: string;
    variant?: 'default' | 'hero';
    badgeText?: string;
}

export const TitleSlideLayout = ({
    title,
    subtitle,
    icon: Icon,
    logoUrl,
    titleMarginBottomClassName = 'mb-4',
    variant = 'default',
    badgeText
}: TitleSlideLayoutProps) => {
    const isHero = variant === 'hero';
    return (
        <div
            className={`flex flex-col items-center justify-center text-center max-w-4xl glass-panel p-8 md:p-12 rounded-[3rem] min-h-[350px] ${
                isHero ? 'relative overflow-hidden' : ''
            }`}
        >
            {isHero && (
                <>
                    <div className="absolute -top-16 -left-20 w-72 h-72 bg-gradient-to-tr from-banking-green/30 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-banking-green/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/[0.03] to-white/0" />
                </>
            )}

            {badgeText && (
                <div className={`relative z-10 mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${
                    isHero
                        ? 'bg-white/5 border-white/10 text-white/80'
                        : 'bg-white/5 border-white/10 text-white/80'
                }`}>
                    <span className="inline-block w-2 h-2 rounded-full bg-banking-green animate-pulse" />
                    {badgeText}
                </div>
            )}

            <div className={`${isHero ? 'relative z-10' : ''} flex flex-col items-center`}>
            {logoUrl && (
                <div className="mb-6 mx-auto bg-white/5 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.1)] overflow-hidden">
                    <img src={logoUrl} alt="Logo" className="w-32 h-32 object-cover object-center" />
                </div>
            )}
            {Icon && !logoUrl && (
                <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.1)]">
                    <Icon className="w-20 h-20 text-white/90" strokeWidth={1.5} />
                </div>
            )}
            <h1
                className={`text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight ${
                    isHero 
                        ? 'glossy-sweep' 
                        : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60'
                } ${titleMarginBottomClassName} drop-shadow-sm`}
            >
                {title}
            </h1>
            {subtitle && (
                <p
                    className={`text-lg md:text-2xl font-light max-w-3xl leading-relaxed ${
                        isHero ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white/70' : 'text-white/70'
                    }`}
                >
                    {subtitle}
                </p>
            )}
            </div>
        </div>
    );
};
