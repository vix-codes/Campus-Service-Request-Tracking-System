import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import IconButton from "./IconButton";
import { MoonIcon, SettingsIcon, SunIcon } from "./icons";

const GlobalSettings = () => {
  const [open, setOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="global-settings">
      {open && (
        <div className="global-settings__panel card">
          <button
            type="button"
            className="button button--ghost global-settings__theme"
            onClick={toggleTheme}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
            <span>{isDarkMode ? "Switch to Light" : "Switch to Dark"}</span>
          </button>
        </div>
      )}

      <IconButton
        className="global-settings__toggle"
        onClick={() => setOpen((prev) => !prev)}
        title="Settings"
      >
        <SettingsIcon />
      </IconButton>
    </div>
  );
};

export default GlobalSettings;
