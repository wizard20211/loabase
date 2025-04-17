import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import "../styles/toastui-dark.css";

const BoardDetail = ({ nickname }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "boards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("존재하지 않는 게시글입니다.");
          navigate("/board");
        }
      } catch (err) {
        console.error("게시글 불러오기 오류:", err);
        alert("오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "boards", id));
      alert("삭제 완료!");
      navigate("/board");
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-4 text-white">불러오는 중...</div>;
  if (!post) return null;

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-1">{post.title}</h2>
      <div className="text-sm text-[#aaa] mb-4">
        by {post.writer} / {post.createdAt?.toDate().toLocaleDateString("ko-KR")}
      </div>

      <div className="text-sm text-[#f7f7f7] whitespace-pre-wrap mb-6">
        <Viewer initialValue={post.content || ""} />
      </div>

      <div className="flex gap-2">
        {nickname === post.writer && (
          <>
            <Link
              to={`/board/edit/${post.id}`}
              className="px-3 py-1 text-sm rounded bg-[#31373f] text-white hover:bg-[#3f454f]"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              삭제
            </button>
          </>
        )}
        <Link
          to="/board"
          className="px-3 py-1 text-sm rounded border border-[#31373f] text-white hover:bg-[#1b1d22]"
        >
          목록
        </Link>
      </div>
    </div>
  );
};

export default BoardDetail;
