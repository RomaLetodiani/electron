import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Home } from "./pages/home/home";
import { UpdateBanner } from "./components/update-banner/update-banner";
import { collapseWindow, homeWindow } from "./utils/animate";
import "./App.css";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleCollapse = () => {
    setIsExpanded(false);
    collapseWindow();
  };

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      homeWindow();
      navigate("/home");
    }
  };

  useEffect(() => {
    const unsubscribeToggle = window.electron.on("toggle-expand", () => {
      setIsExpanded(!isExpanded);
      if (isExpanded) {
        collapseWindow();
      } else {
        homeWindow();
        navigate("/home");
      }
    });

    const unsubscribeCollapse = window.electron.on("collapse", () => {
      if (isExpanded) {
        if (pathname === "/home") {
          handleCollapse();
        } else {
          navigate("/home");
        }
      }
    });

    return () => {
      unsubscribeToggle();
      unsubscribeCollapse();
    };
  }, [isExpanded, setIsExpanded, pathname, navigate]);

  return (
    <div className={`${isExpanded ? "AppExpanded" : "AppCollapsed"}`} onClick={handleExpand}>
      <span className="CollapseButton">⌥ + Space</span>
      <div className="AppContent">
        <UpdateBanner />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
