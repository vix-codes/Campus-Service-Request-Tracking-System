const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const BellIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4v-3a6 6 0 1 0-12 0v3a2 2 0 0 1-.6 1.4L4 17h5" />
    <path d="M9 17a3 3 0 0 0 6 0" />
  </svg>
);

export const RefreshIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M20 11a8 8 0 1 0 2 5.3" />
    <path d="M20 4v7h-7" />
  </svg>
);

export const LogoutIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);

export const DashboardIcon = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </svg>
);

export const FileIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
);

export const ChartIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M4 19V5" />
    <path d="M4 19h16" />
    <path d="M8 15V9" />
    <path d="M12 15V7" />
    <path d="M16 15v-4" />
  </svg>
);

export const UserPlusIcon = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="9" cy="8" r="4" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M19 8v6" />
    <path d="M16 11h6" />
  </svg>
);

export const ActivityIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M3 12h4l2-5 4 10 2-5h6" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const ChevronLeftIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const SettingsIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
  </svg>
);

export const SunIcon = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.9 4.9 1.4 1.4" />
    <path d="m17.7 17.7 1.4 1.4" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.3 17.7-1.4 1.4" />
    <path d="m19.1 4.9-1.4 1.4" />
  </svg>
);

export const MoonIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
