import { useEffect, useRef, useState } from 'react';
import '../../styles/CustomCursor.css';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const dotRef = useRef<HTMLDivElement | null>(null);
    const glowRef = useRef<HTMLDivElement | null>(null);
    const [enabled, setEnabled] = useState(true);

    const mouse = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Detect touch / coarse pointer devices and disable custom cursor
        const isCoarse = typeof window !== 'undefined' && (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
        if (isCoarse) {
            setEnabled(false);
            return; // skip setting up listeners / animation
        }

        const move = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }
        };

        document.addEventListener("mousemove", move);

        const animate = () => {
            const { x, y } = cursorPos.current;
            const dx = mouse.current.x - x;
            const dy = mouse.current.y - y;

            cursorPos.current.x += dx * 0.1;
            cursorPos.current.y += dy * 0.1;

            if (cursorRef.current) {
                cursorRef.current.style.left = `${cursorPos.current.x}px`;
                cursorRef.current.style.top = `${cursorPos.current.y}px`;
            }

            if (glowRef.current) {
                glowRef.current.style.left = `${cursorPos.current.x}px`;
                glowRef.current.style.top = `${cursorPos.current.y}px`;
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener("mousemove", move);
        };
    }, []);

    if (!enabled) return null;

    return (
        <>
            <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
            <div ref={cursorRef} className="cursor">
                <div className="lens" />
            </div>
            <div ref={dotRef} className="center-dot" />
        </>
    );
};

export default CustomCursor;
