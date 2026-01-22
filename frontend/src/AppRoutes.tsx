import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"
import Decks from "./pages/Decks/Decks";



export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/> // Default route
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="/decks" element={<Decks/>}/>
        </Routes>
    );
}


