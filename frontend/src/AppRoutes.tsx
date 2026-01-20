import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";



export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/faq" element={<FAQ/>}/>
        </Routes>
    );
}


