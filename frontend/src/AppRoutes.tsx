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
            <Route path="/classes" element={<Placeholder title="Klassen" />} />
            <Route path="/history" element={<Placeholder title="Geschiedenis" />} />
            <Route path="/faq" element={<FAQ/>}/>
        </Routes>
    );
}


