import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardEditor = ({ nickname }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const editorRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "boards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCategory(data.category || "");
          editorRef.current?.getInstance().setHTML(data.content || "");
        } else {
          alert("존재하지 않는 게시글입니다.");
          navigate("/board");
        }
      } catch (err) {
        console.error("게시글 불러오기 오류:", err);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async () => {
    const content = editorRef.current?.getInstance().getHTML();

    if (!nickname) return alert("로그인이 필요합니다.");
    if (!category) return alert("카테고리를 선택해주세요.");
    if (!title || !content) return alert("제목과 내용을 입력하세요.");

    try {
      if (id) {
        await updateDoc(doc(db, "boards", id), {
          title,
          category,
          content,
        });
        alert("수정 완료!");
      } else {
        await addDoc(collection(db, "boards"), {
          title,
          content,
          category,
          writer: nickname,
          createdAt: Timestamp.now(),
        });
        alert("등록 완료!");
      }
      navigate("/board");
    } catch (err) {
      console.error("등록/수정 오류:", err);
      alert("작업에 실패했습니다.");
    }
  };

  return (
    <div className="p-4 text-white">
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-40 p-2 bg-[#1b1d22] border border-[#31373f] rounded"
        >
          <option disabled value="">카테고리 선택</option>
          <option value="잡담">잡담</option>
          <option value="정보">정보</option>
          <option value="기타">기타</option>
        </select>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full p-2 bg-[#1b1d22] border border-[#31373f] rounded mt-2 md:mt-0"
        />
      </div>
      <div className="toast-editor-dark">
        <Editor
        ref={editorRef}
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        hideModeSwitch={true}
      />

      </div>
  
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-[#50ce97] text-black rounded"
      >
        {id ? "수정" : "등록"}
      </button>
    </div>
  );
};

export default BoardEditor;
