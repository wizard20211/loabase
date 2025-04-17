// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BoardList from "./pages/BoardList";
import BoardDetail from "./pages/BoardDetail";
import BoardEditor from "./pages/BoardEditor";
import BoardLayout from "./layouts/BoardLayout";
import { auth, provider } from "./firebase-config";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🟡 Firebase 상태 변경 감지됨:", user);
      if (user) {
        const name = user.displayName || user.email || "익명";
        setNickname(name);
        localStorage.setItem("nickname", name);
      } else {
        setNickname("");
        localStorage.removeItem("nickname");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("❌ 로그아웃 실패:", err);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              nickname={nickname}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/board"
          element={
            <BoardLayout nickname={nickname} onLogin={handleLogin} onLogout={handleLogout}>
              <BoardList nickname={nickname} />
            </BoardLayout>
          }
        />

        <Route
          path="/board/:id"
          element={
            <BoardLayout nickname={nickname} onLogin={handleLogin} onLogout={handleLogout}>
              <BoardDetail nickname={nickname} />
            </BoardLayout>
          }
        />

        <Route
          path="/board/write"
          element={
            <BoardLayout nickname={nickname} onLogin={handleLogin} onLogout={handleLogout}>
              <BoardEditor nickname={nickname} />
            </BoardLayout>
          }
        />

        <Route
          path="/board/edit/:id"
          element={
            <BoardLayout nickname={nickname} onLogin={handleLogin} onLogout={handleLogout}>
              <BoardEditor nickname={nickname} />
            </BoardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;