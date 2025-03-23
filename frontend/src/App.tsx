import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AddQuestionnaire from "./pages/AddQuestionnaire";
import Home from "./pages/Home";
import RunQuestionaire from "./pages/RunQuestionaire";
import EditQuestionnaire from "./pages/EditQuestionnaire";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-questionnaire" element={<AddQuestionnaire />} />
        <Route path="/run-questionnaire/:id" element={<RunQuestionaire />} />
        <Route path="/edit-questionnaire/:id" element={<EditQuestionnaire />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
