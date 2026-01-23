import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"
import NotFound from "./pages/NotFound/NotFound";



export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/> // Default route
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}


