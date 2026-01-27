import { Route, Routes } from 'react-router-dom';
import FAQ from './pages/FAQ/FAQ';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import SettingsPage from './pages/Settings/Settings';
import NoavaFooter from './shared/components/NoavaFooter';
import PrivateRoute from './shared/components/navigation/PrivateRoute';
import { RoleGroups } from './models/User';
import NotificationPage from "./pages/Notification/Notification";

function Placeholder({ title }: { title: string }) {
  return <NoavaFooter />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/decks" element={<Placeholder title="Decks" />} />
      <Route path="/classrooms" element={<Placeholder title="Klassen" />} />
      <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/faq" element={<FAQ />} />
      <Route
        element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
        <Route path="/dashboard" />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}