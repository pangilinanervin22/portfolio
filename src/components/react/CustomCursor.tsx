import { useEffect, useRef, useState } from 'react';
import '../../styles/CustomCursor.css';

const CROSS_SIZE = 19; // keep in sync with .cursor-cross in CustomCursor.css
const IDLE_SIZE = 26; // frame box when not locked onto a target
const LOCK_PAD = 6; // breathing room between a locked target and the brackets
const LERP = 0.22;

// Native interactive elements, plus anything opting in via data-cursor.
// data-cursor-label="…" replaces the W×H readout with a custom annotation.
const INTERACTIVE = 'a, button, [role="button"], label, input, summary, [data-cursor]';

const CustomCursor: React.FC = () => {
    const crossRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<HTMLDivElement | null>(null);
    const dimsRef = useRef<HTMLSpanElement | null>(null);
    const [enabled, setEnabled] = useState(true);

    const mouse = useRef({ x: 0, y: 0 });
    const box = useRef({ x: 0, y: 0, w: IDLE_SIZE, h: IDLE_SIZE });
    const locked = useRef<Element | null>(null);
    const dimsText = useRef('');
    const raf = useRef<number>(0);

    useEffect(() => {
        // Detect touch / coarse pointer devices and disable custom cursor
        const isCoarse = typeof window !== 'undefined' && (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
        if (isCoarse) {
            setEnabled(false);
            return; // skip setting up listeners / animation
        }

        // Native cursor is only hidden once the island is live (see global.css),
        // so a JS failure never leaves the page cursorless.
        document.documentElement.classList.add('has-custom-cursor');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lerp = reduceMotion ? 1 : LERP;

        const move = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (crossRef.current) {
                crossRef.current.style.transform = `translate3d(${e.clientX - CROSS_SIZE / 2}px, ${e.clientY - CROSS_SIZE / 2}px, 0)`;
            }

            // Lock the bracket frame onto interactive targets
            const target = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
            if (target !== locked.current) {
                locked.current = target;
                frameRef.current?.classList.toggle('is-locked', Boolean(target));
            }
        };

        const press = () => {
            crossRef.current?.classList.add('is-pressed');
            frameRef.current?.classList.add('is-pressed');
        };
        const release = () => {
            crossRef.current?.classList.remove('is-pressed');
            frameRef.current?.classList.remove('is-pressed');
        };

        const hide = () => {
            crossRef.current?.classList.add('is-hidden');
            frameRef.current?.classList.add('is-hidden');
        };
        const show = () => {
            crossRef.current?.classList.remove('is-hidden');
            frameRef.current?.classList.remove('is-hidden');
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mousedown', press);
        document.addEventListener('mouseup', release);
        document.documentElement.addEventListener('mouseleave', hide);
        document.documentElement.addEventListener('mouseenter', show);

        const animate = () => {
            let tx: number, ty: number, tw: number, th: number;

            if (locked.current?.isConnected) {
                // Re-measure every frame so the brackets track scrolling and
                // any hover transforms on the target itself.
                const r = locked.current.getBoundingClientRect();
                tx = r.left - LOCK_PAD;
                ty = r.top - LOCK_PAD;
                tw = r.width + LOCK_PAD * 2;
                th = r.height + LOCK_PAD * 2;

                const text = locked.current.getAttribute('data-cursor-label') || `${Math.round(r.width)}×${Math.round(r.height)}`;
                if (text !== dimsText.current && dimsRef.current) {
                    dimsText.current = text;
                    dimsRef.current.textContent = text;
                }
            } else {
                if (locked.current) {
                    locked.current = null;
                    frameRef.current?.classList.remove('is-locked');
                }
                tw = IDLE_SIZE;
                th = IDLE_SIZE;
                tx = mouse.current.x - IDLE_SIZE / 2;
                ty = mouse.current.y - IDLE_SIZE / 2;
            }

            const b = box.current;
            b.x += (tx - b.x) * lerp;
            b.y += (ty - b.y) * lerp;
            b.w += (tw - b.w) * lerp;
            b.h += (th - b.h) * lerp;

            if (frameRef.current) {
                frameRef.current.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
                frameRef.current.style.width = `${b.w}px`;
                frameRef.current.style.height = `${b.h}px`;
            }

            raf.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mousedown', press);
            document.removeEventListener('mouseup', release);
            document.documentElement.removeEventListener('mouseleave', hide);
            document.documentElement.removeEventListener('mouseenter', show);
            cancelAnimationFrame(raf.current);
        };
    }, []);

    if (!enabled) return null;

    return (
        <>
            <div ref={crossRef} className="cursor-cross" aria-hidden="true" />
            <div ref={frameRef} className="cursor-frame" aria-hidden="true">
                <span className="c tl" />
                <span className="c tr" />
                <span className="c bl" />
                <span className="c br" />
                <span ref={dimsRef} className="cursor-dims" />
            </div>
        </>
    );
};

export default CustomCursor;
