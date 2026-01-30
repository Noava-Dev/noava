import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"
import Decks from "./pages/Decks/Decks";
import Classrooms from "./pages/Classrooms/Classrooms";
import ClassroomDetail from "./pages/Classrooms/ClassroomDetail";
import JoinClassroom from "./pages/Classrooms/JoinClassroom";
import MembersPage from './pages/Classrooms/Members';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import SettingsPage from './pages/Settings/Settings';
import NoavaFooter from './shared/components/NoavaFooter';
import { SignUp as SignUpClerk } from '@clerk/clerk-react';
import { SignIn as SignInClerk } from '@clerk/clerk-react';
import PrivateRoute from './shared/components/navigation/PrivateRoute';
import { RoleGroups } from './models/User';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import QuickReview from '../src/pages/Review/Quickreview';
import NotificationPage from './pages/Notification/Notification';
import Loading from './shared/components/Loading';
import FlashcardDetail from './pages/Flashcards/FlashcardDetail';
import NoavaSidebar from './shared/components/navigation/NoavaSidebar';
import Dashboard from './pages/Dashboard/Dashboard';

function Placeholder({ title }: { title: string }) {
  return (
    <>
      <div>{title}</div>
      <NoavaFooter />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
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
      <Route path="/" element={<Home />} />
      <Route path="/decks" element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
          <Route index element={<Decks />} />
          <Route path=":deckId/cards" element={<FlashcardDetail />} />
          <Route path=":deckId/review" element={<QuickReview />} />
      </Route>
        <Route path="/classrooms" element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
          <Route index element={<Classrooms />} />
          <Route path="join" element={<JoinClassroom />} />
          <Route path=":classroomId" element={<ClassroomDetail />} />
            <Route path=":classroomId/members" element={<MembersPage />} />
        </Route>
      <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/faq" element={<FAQ />} />
      <Route
        element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
        <Route path="/dashboard" element={<Dashboard />} />
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
