import { useEffect, useRef } from 'react'
import '../../styles/CustomCursor.scss'

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const dotRef = useRef<HTMLDivElement | null>(null);
    const lensRef = useRef<HTMLDivElement | null>(null);

    const mouse = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }

            if (lensRef.current) {
                lensRef.current.style.left = `${e.clientX}px`;
                lensRef.current.style.top = `${e.clientY}px`;
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

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener("mousemove", move);
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="cursor">
                <div className="dot" />
            </div>
            <div ref={dotRef} className="center-dot" />
        </>
    );
};

export default CustomCursor;
