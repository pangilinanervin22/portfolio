import React, { useEffect, useState } from "react";
import "./SwitchTheme.css"; // make sure you have styles

const SwitchTheme: React.FC = () => {
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    const applyTheme = (theme: string) => {
        document.documentElement.setAttribute("data-theme", theme);
        const themeStylesheet = document.getElementById("theme-stylesheet") as HTMLLinkElement;
        if (themeStylesheet) {
            themeStylesheet.href =
                theme === "dark"
                    ? "../styles/_theme_dark.css"
                    : "../styles/_theme.css";
        }
    };

    return (
        <button className={`theme-toggle ${theme}`} onClick={toggleTheme} aria-label="Toggle Theme">
            <div className="icon-wrapper">
                {theme === "dark" ? (
                    // Sun icon (black)
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
                        <circle cx="12" cy="12" r="5" />
                        <g stroke="black" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="4" />
                            <line x1="12" y1="20" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="4" y2="12" />
                            <line x1="20" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                        </g>
                    </svg>
                ) : (
                    // Moon icon (white)
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                    </svg>
                )}
            </div>
        </button>
    );
}

export default SwitchTheme;
