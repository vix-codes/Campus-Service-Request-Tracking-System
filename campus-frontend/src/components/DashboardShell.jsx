import AppBrand from "./AppBrand";
import NotificationBell from "./NotificationBell";
import IconButton from "./IconButton";
import { ChevronLeftIcon, LogoutIcon, MenuIcon } from "./icons";
import { useAuth } from "../contexts/AuthContext";

const DashboardShell = ({
  greeting,
  navItems,
  activeSection,
  onSectionChange,
  sidebarExpanded,
  onToggleSidebar,
  searchValue = "",
  onSearchChange,
  children,
}) => {
  const { logout } = useAuth();

  const visibleItems = navItems.filter((item) => !item.expandOnly || sidebarExpanded);

  return (
    <div className="dashboard-layout">
      <aside
        className={`dashboard-sidebar ${
          sidebarExpanded ? "dashboard-sidebar--expanded" : "dashboard-sidebar--collapsed"
        }`}
      >
        <div className="dashboard-sidebar__top">
          <AppBrand size="sm" label={sidebarExpanded ? "ASRT System" : "ASRT"} />
          <IconButton
            onClick={onToggleSidebar}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </div>

        <nav className="dashboard-sidebar__nav">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`dashboard-nav-item ${active ? "dashboard-nav-item--active" : ""}`}
                onClick={() => onSectionChange(item.key)}
                title={item.label}
              >
                <Icon className="dashboard-nav-item__icon" />
                {sidebarExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar card">
          <div className="dashboard-topbar__greeting">{greeting}</div>

          {onSearchChange ? (
            <input
              type="search"
              placeholder="Search complaints..."
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          ) : (
            <div />
          )}

          <div className="dashboard-topbar__actions">
            <NotificationBell />
            <button type="button" className="button button--ghost button--small" onClick={logout}>
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="dashboard-main__content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardShell;
