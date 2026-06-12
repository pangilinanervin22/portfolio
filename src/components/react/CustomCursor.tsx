import { useEffect, useRef, useState } from 'react';
import '../../styles/CustomCursor.css';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const dotRef = useRef<HTMLDivElement | null>(null);
    const [enabled, setEnabled] = useState(true);

    const mouse = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const raf = useRef<number>(0);

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
                dotRef.current.style.transform = `translate3d(${e.clientX - 2.5}px, ${e.clientY - 2.5}px, 0)`;
            }

            // Grow the ring over interactive targets
            const interactive =
                e.target instanceof Element &&
                e.target.closest('a, button, [role="button"], label, input, summary');
            cursorRef.current?.classList.toggle('cursor--link', Boolean(interactive));
        };

        const hide = () => {
            cursorRef.current?.classList.add('cursor--hidden');
            dotRef.current?.classList.add('cursor--hidden');
        };
        const show = () => {
            cursorRef.current?.classList.remove('cursor--hidden');
            dotRef.current?.classList.remove('cursor--hidden');
        };

        document.addEventListener('mousemove', move);
        document.documentElement.addEventListener('mouseleave', hide);
        document.documentElement.addEventListener('mouseenter', show);

        const animate = () => {
            const { x, y } = cursorPos.current;
            const dx = mouse.current.x - x;
            const dy = mouse.current.y - y;

            cursorPos.current.x += dx * 0.16;
            cursorPos.current.y += dy * 0.16;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${cursorPos.current.x - 16}px, ${cursorPos.current.y - 16}px, 0)`;
            }

            raf.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener('mousemove', move);
            document.documentElement.removeEventListener('mouseleave', hide);
            document.documentElement.removeEventListener('mouseenter', show);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    if (!enabled) return null;

    return (
        <>
            <div ref={cursorRef} className="cursor" aria-hidden="true" />
            <div ref={dotRef} className="center-dot" aria-hidden="true" />
        </>
    );
};

export default CustomCursor;
