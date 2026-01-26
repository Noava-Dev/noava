import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"
import Decks from "./pages/Decks/Decks";
import NotFound from "./pages/NotFound/NotFound";
import SettingsPage from "./pages/Settings/Settings";

function Placeholder({ title }: { title: string }) {
  return <h1 className="p-6 text-2xl font-bold">{title}</h1>;
}

import PrivateRoute from "./shared/components/navigation/PrivateRoute";
import { RoleGroups } from "./models/User"; 

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/> 
            <Route path="/decks" element={<Placeholder title="Decks" />} />
            <Route path="/classrooms" element={<Placeholder title="Klassen" />} />
            <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
            <Route path="/notifications" element={<Placeholder title="Meldingen" />} />
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="/decks" element={<Decks/>}/>
            <Route element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
                <Route path="/dashboard" />
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}