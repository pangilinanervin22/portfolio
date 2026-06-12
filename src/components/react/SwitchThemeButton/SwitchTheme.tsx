import React, { useEffect, useState } from "react";
import "./SwitchTheme.css";

const getInitialTheme = (): string => {
    if (typeof window === "undefined") return "light";
    try {
        return (
            localStorage.getItem("theme") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light")
        );
    } catch {
        return "light";
    }
};

const SwitchTheme: React.FC = () => {
    const [theme, setTheme] = useState<string>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch {
            // localStorage unavailable (private mode) — theme still applies
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
            {theme === "dark" ? (
                // Sun
                <svg
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
            ) : (
                // Moon
                <svg
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
            )}
        </button>
    );
};

export default SwitchTheme;
