import React, { useCallback, useEffect, useState } from "react";
import "./SwitchTheme.css";

type Theme = "light" | "dark";

const THEME_COLOR: Record<Theme, string> = { light: "#faf8f6", dark: "#111110" };

const readTheme = (): Theme =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

const SwitchTheme: React.FC = () => {
    // The inline <head> script already applied the saved/system theme before
    // paint. State starts unknown so the server-rendered markup (both icons,
    // CSS picks one) never disagrees with the first client render.
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => {
        setTheme(readTheme());
    }, []);

    useEffect(() => {
        if (!theme) return;
        document.documentElement.setAttribute("data-theme", theme);
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
        try {
            localStorage.setItem("theme", theme);
        } catch {
            // localStorage unavailable (private mode) — theme still applies
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => ((prev ?? readTheme()) === "dark" ? "light" : "dark"));
    }, []);

    const next = theme === "dark" ? "light" : "dark";

    return (
        <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme ? `Switch to ${next} theme` : "Switch theme"}
        >
            {/* Sun — shown in dark mode */}
            <svg
                className="theme-icon theme-icon--sun"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="4.2" />
                <line x1="12" y1="2.5" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21.5" />
                <line x1="2.5" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21.5" y2="12" />
                <line x1="5.3" y1="5.3" x2="7" y2="7" />
                <line x1="17" y1="17" x2="18.7" y2="18.7" />
                <line x1="5.3" y1="18.7" x2="7" y2="17" />
                <line x1="17" y1="7" x2="18.7" y2="5.3" />
            </svg>
            {/* Moon — shown in light mode */}
            <svg
                className="theme-icon theme-icon--moon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
            </svg>
        </button>
    );
};

export default SwitchTheme;
