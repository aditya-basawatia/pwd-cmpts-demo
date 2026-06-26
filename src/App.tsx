import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import InternalLayout from '@/components/InternalLayout';
import HomePage from '@/pages/HomePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import LodgeComplaintPage from '@/pages/LodgeComplaintPage';
import TrackComplaintPage from '@/pages/TrackComplaintPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ComplaintsPage from '@/pages/ComplaintsPage';
import ComplaintDetailPage from '@/pages/ComplaintDetailPage';
import InternalProjectsPage from '@/pages/InternalProjectsPage';
import WorkOrdersPage from '@/pages/WorkOrdersPage';
import TeamPage from '@/pages/TeamPage';
import ReportsPage from '@/pages/ReportsPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import AuditLogPage from '@/pages/AuditLogPage';
import AppShell from '@/components/AppShell';
import AppLoginPage from '@/pages/app/AppLoginPage';
import AppHomePage from '@/pages/app/AppHomePage';
import HierarchyPage from '@/pages/app/HierarchyPage';
import FieldCapturePage from '@/pages/app/FieldCapturePage';
import AppProjectsPage from '@/pages/app/AppProjectsPage';
import AppProjectDetailPage from '@/pages/app/AppProjectDetailPage';
import AppProfilePage from '@/pages/app/AppProfilePage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="lodge" element={<LodgeComplaintPage />} />
        <Route path="track" element={<TrackComplaintPage />} />
      </Route>
      <Route path="internal/login" element={<LoginPage />} />
      <Route path="internal" element={<InternalLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="projects" element={<InternalProjectsPage />} />
        <Route path="work-orders" element={<WorkOrdersPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="audit" element={<AuditLogPage />} />
      </Route>
      <Route path="app/login" element={<AppLoginPage />} />
      <Route path="app" element={<AppShell />}>
        <Route index element={<AppHomePage />} />
        <Route path="hierarchy" element={<HierarchyPage />} />
        <Route path="capture" element={<FieldCapturePage />} />
        <Route path="projects" element={<AppProjectsPage />} />
        <Route path="projects/:id" element={<AppProjectDetailPage />} />
        <Route path="profile" element={<AppProfilePage />} />
      </Route>
    </Routes>
  );
}
