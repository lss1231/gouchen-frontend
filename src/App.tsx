import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatPage } from "./pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        {/* 预留管理后台路由 */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
