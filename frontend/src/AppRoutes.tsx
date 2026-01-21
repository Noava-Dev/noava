import {Route, Routes} from "react-router-dom";
import FAQ from "./pages/FAQ/FAQ";

function Placeholder({ title }: { title: string }) {
  return <h1 className="p-6 text-2xl font-bold">{title}</h1>;
}

export default function AppRoutes() {
    return (
        <Routes>
           <Route path="/" element={<Placeholder title="Dashboard" />} />
            <Route path="/decks" element={<Placeholder title="Decks" />} />
            <Route path="/klassen" element={<Placeholder title="Klassen" />} />
            <Route path="/geschiedenis" element={<Placeholder title="Geschiedenis" />} />
            <Route path="/meldingen" element={<Placeholder title="Meldingen" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="/faq" element={<FAQ/>}/>
        </Routes>
    );
}


