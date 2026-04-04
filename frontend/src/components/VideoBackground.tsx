import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoBackgroundProps {
    src: string;
    overlayOpacity?: number;
}

export const VideoBackground = ({ src, overlayOpacity = 0.6 }: VideoBackgroundProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | undefined;

        if (Hls.isSupported() && src.endsWith('.m3u8')) {
            hls = new Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            });
        } else {
            video.src = src;
            video.play().catch(e => console.log('Autoplay prevented:', e));
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [src]);

    return (
        /* fixed: always fills the viewport behind everything */
        <div style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden' }}>
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translate(-50%, -50%) scale(1.05)',
                    pointerEvents: 'none',
                }}
            />
            {/* Hard dark glass overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: `rgba(11, 15, 25, ${overlayOpacity})`,
                    backdropFilter: 'blur(4px)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};
