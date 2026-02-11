import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useFetch from "../hooks/useFetch";
import CreateComplaintForm from "../components/CreateComplaintForm";
import TenantComplaintCard from "../components/TenantComplaintCard";
import NoticeBanner from "../components/NoticeBanner";
import DashboardShell from "../components/DashboardShell";
import IconButton from "../components/IconButton";
import { DashboardIcon, FileIcon, PlusIcon, RefreshIcon } from "../components/icons";

const sections = {
  DASHBOARD: "dashboard",
  COMPLAINTS: "complaints",
  CREATE: "create",
};

const TenantDashboard = () => {
  const { userName } = useAuth();
  const [notice, setNotice] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(sections.DASHBOARD);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: complaints, loading, refetch } = useFetch("/complaints");
  const {
    data: latestUnclosed,
    loading: latestLoading,
    refetch: refetchLatest,
  } = useFetch("/complaints?includeClosed=false&limit=8");

  const filteredComplaints = useMemo(() => {
    const list = complaints || [];
    if (!searchTerm.trim()) return list;
    const needle = searchTerm.trim().toLowerCase();
    return list.filter((complaint) =>
      [complaint.title, complaint.description, complaint.token, complaint.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [complaints, searchTerm]);

  const navItems = [
    { key: sections.DASHBOARD, label: "Dashboard", icon: DashboardIcon },
    { key: sections.COMPLAINTS, label: "My Complaints", icon: FileIcon },
    { key: sections.CREATE, label: "New Complaint", icon: PlusIcon, expandOnly: true },
  ];

  const handleToggleSidebar = () => {
    setSidebarExpanded((prev) => {
      const next = !prev;
      if (!next && activeSection === sections.CREATE) {
        setActiveSection(sections.DASHBOARD);
      }
      return next;
    });
  };

  const renderComplaintGrid = (list) => (
    <div className="grid">
      {list.map((complaint) => (
        <TenantComplaintCard
          key={complaint._id}
          complaint={complaint}
          setNotice={setNotice}
          onUpdated={() => {
            refetch();
            refetchLatest();
          }}
        />
      ))}
    </div>
  );

  return (
    <DashboardShell
      greeting={`Welcome, ${userName || "Tenant"}`}
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      sidebarExpanded={sidebarExpanded}
      onToggleSidebar={handleToggleSidebar}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <NoticeBanner message={notice?.message} tone={notice?.tone} onClose={() => setNotice(null)} />

      {activeSection === sections.DASHBOARD && (
        <section className="section section--first">
          <div className="section__header">
            <div>
              <h3>Latest Unclosed Complaints</h3>
              <p className="muted">Your latest complaints that are still open.</p>
            </div>
            <IconButton
              onClick={refetchLatest}
              disabled={latestLoading}
              title={latestLoading ? "Refreshing..." : "Refresh dashboard"}
            >
              <RefreshIcon className={latestLoading ? "spin" : ""} />
            </IconButton>
          </div>
          {!(latestUnclosed || []).length && <p className="muted">No open complaints right now.</p>}
          {renderComplaintGrid(latestUnclosed || [])}
        </section>
      )}

      {activeSection === sections.COMPLAINTS && (
        <section className="section section--first">
          <div className="section__header">
            <div>
              <h3>All My Complaints</h3>
              <p className="muted">Track each request and reopen rejected ones.</p>
            </div>
            <IconButton
              onClick={refetch}
              disabled={loading}
              title={loading ? "Refreshing..." : "Refresh complaints"}
            >
              <RefreshIcon className={loading ? "spin" : ""} />
            </IconButton>
          </div>
          {filteredComplaints.length === 0 && <p className="muted">No complaints match your search.</p>}
          {renderComplaintGrid(filteredComplaints)}
        </section>
      )}

      {activeSection === sections.CREATE && (
        <section className="section section--first">
          <CreateComplaintForm
            onComplaintCreated={() => {
              refetch();
              refetchLatest();
            }}
            setNotice={setNotice}
          />
        </section>
      )}
    </DashboardShell>
  );
};

export default TenantDashboard;
