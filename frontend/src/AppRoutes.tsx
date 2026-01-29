import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"
import Decks from "./pages/Decks/Decks";
import Classrooms from "./pages/Classrooms/Classrooms";
import ClassroomDetail from "./pages/Classrooms/ClassroomDetail";
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import SettingsPage from './pages/Settings/Settings';
import NoavaFooter from './shared/components/NoavaFooter';
import PrivateRoute from './shared/components/navigation/PrivateRoute';
import { RoleGroups } from './models/User';
import NotificationPage from "./pages/Notification/Notification";
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import FlashcardDetail from "./pages/Flashcards/FlashcardDetail";

function Placeholder({ title }: { title: string }) {
  return <NoavaFooter />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/decks" element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
          <Route index element={<Decks />} />
          <Route path=":deckId/cards" element={<FlashcardDetail />} />
      </Route>
        <Route path="/classrooms" element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
          <Route index element={<Classrooms />} />
          <Route path=":classroomId" element={<ClassroomDetail />} />
        </Route>
      <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/faq" element={<FAQ />} />
      <Route
        element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
        <Route path="/dashboard" />
      </Route>
      
      <Route path="*" element={<NotFound />} />

      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={RoleGroups.ADMIN_ONLY} />}>
        <Route path="/admin">
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}