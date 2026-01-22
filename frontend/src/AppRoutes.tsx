import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home"

function Placeholder({ title }: { title: string }) {
  return <h1 className="p-6 text-2xl font-bold">{title}</h1>;
}

export default function AppRoutes() {
    return (
        <Routes>
           <Route path="/home" element={<Home/>} />
            <Route path="/decks" element={<Placeholder title="Decks" />} />
            <Route path="/classrooms" element={<Placeholder title="Klassen" />} />
            <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
            <Route path="/notifications" element={<Placeholder title="Meldingen" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="/faq" element={<FAQ/>}/>
        </Routes>
    );
}


