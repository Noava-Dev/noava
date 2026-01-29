import { Route, Routes } from 'react-router-dom';
import FAQ from './pages/FAQ/FAQ';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import SettingsPage from './pages/Settings/Settings';
import NoavaFooter from './shared/components/NoavaFooter';
import { SignUp as SignUpClerk } from "@clerk/clerk-react";
import { SignIn as SignInClerk } from "@clerk/clerk-react";
import PrivateRoute from './shared/components/navigation/PrivateRoute';
import { RoleGroups } from './models/User';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import Loading from './shared/components/Loading';

function Placeholder({ title }: { title: string }) {
  return <NoavaFooter />;
}



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={
        <div className="min-h-screen flex items-center justify-center py-8">
          <SignInClerk fallback={<Loading />} />
        </div>
        } />
      <Route path="/sign-up" element={
        <div className="min-h-screen flex items-center justify-center py-8">
          <SignUpClerk fallback={<Loading />} />
        </div>
        } />
      <Route path="/" element={<Home />} />
      <Route path="/decks" element={<Placeholder title="Decks" />} />
      <Route path="/classrooms" element={<Placeholder title="Klassen" />} />
      <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
      <Route
        path="/notifications"
        element={<Placeholder title="Meldingen" />}
      />
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
