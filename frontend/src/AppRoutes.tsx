import FAQ from './pages/FAQ/FAQ';
import Home from './pages/Home/Home';
import Decks from './pages/Decks/Decks';
import Classrooms from './pages/Classrooms/Classrooms';
import ClassroomDetail from './pages/Classrooms/ClassroomDetail';
import JoinClassroom from './pages/Classrooms/JoinClassroom';
import MembersPage from './pages/Classrooms/Members';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import SettingsPage from './pages/Settings/Settings';
import { SignUp as SignUpClerk } from '@clerk/clerk-react';
import { SignIn as SignInClerk } from '@clerk/clerk-react';
import PrivateRoute from './shared/components/navigation/PrivateRoute';
import { RoleGroups } from './models/User';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import SchoolsPage from './pages/Schools/Schools';
import QuickReview from '../src/pages/Review/Quickreview';
import NotificationPage from './pages/Notification/Notification';
import Loading from './shared/components/Loading';
import FlashcardDetail from './pages/Flashcards/FlashcardDetail';
import Dashboard from './pages/Dashboard/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Unauthenticated Routes */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Authentication */}
      <Route
        path="/sign-in"
        element={
          <div className="flex items-center justify-center min-h-screen py-8">
            <SignInClerk fallback={<Loading />} />
          </div>
        }
      />
      <Route
        path="/sign-up"
        element={
          <div className="flex items-center justify-center min-h-screen py-8">
            <SignUpClerk fallback={<Loading />} />
          </div>
        }
      />

      {/* Authenticated Routes */}
      <Route
        element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Decks */}
        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:deckId/cards" element={<FlashcardDetail />} />
        <Route path="/decks/:deckId/review" element={<QuickReview />} />

        {/* Classrooms */}
        <Route path="/classrooms" element={<Classrooms />} />
        <Route path="/classrooms/join" element={<JoinClassroom />} />
        <Route path="/classrooms/:classroomId" element={<ClassroomDetail />} />
        <Route
          path="/classrooms/:classroomId/members"
          element={<MembersPage />}
        />

        {/* Notifications */}
        <Route path="/notifications" element={<NotificationPage />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={RoleGroups.ADMIN_ONLY} />}>
        <Route path="/admin">
          {/* Dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Schools */}
          <Route path="schools" element={<SchoolsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
