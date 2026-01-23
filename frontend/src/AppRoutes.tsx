import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"
import PrivateRoute from "./shared/components/navigation/PrivateRoute";
import { RoleGroups } from "./models/User";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/> 
            <Route path="/faq" element={<FAQ/>}/>
            <Route element={<PrivateRoute allowedRoles={RoleGroups.ALL_AUTHENTICATED} />}>
                <Route path="/dashboard"/>
            </Route>
        </Routes>
    );
}