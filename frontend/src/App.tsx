import './App.css';
import AppRoutes from './AppRoutes';
import { UserRoleProvider } from './contexts/UserRoleContext';

function App() {


  return (
    <UserRoleProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </UserRoleProvider>
  );
}

export default App;