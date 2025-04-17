import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase-config";

const BoardList = ({ nickname }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all"); // 제목, 내용, 닉네임
  const [categoryFilter, setCategoryFilter] = useState("all"); // 잡담, 정보, 기타

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const fetchPosts = async () => {
    const q = query(collection(db, "boards"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const allPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(allPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let temp = [...posts];

    // 카테고리 필터
    if (categoryFilter !== "all") {
      temp = temp.filter((post) => post.category === categoryFilter);
    }

    // 검색 필터
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter((post) => {
        if (searchCategory === "all") {
          return (
            post.title?.toLowerCase().includes(lower) ||
            post.content?.toLowerCase().includes(lower) ||
            post.writer?.toLowerCase().includes(lower)
          );
        }
        if (searchCategory === "title") {
          return post.title?.toLowerCase().includes(lower);
        }
        if (searchCategory === "nickname") {
          return post.writer?.toLowerCase().includes(lower);
        }
        if (searchCategory === "content") {
          return post.content?.toLowerCase().includes(lower);
        }
        return true;
      });
    }

    setFilteredPosts(temp);
    setCurrentPage(1); // 검색 or 카테고리 변경 시 페이지 초기화
  }, [posts, searchTerm, searchCategory, categoryFilter]);

  // 페이지 계산
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="w-full">
      {/* 상단 검색 + 글쓰기 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <h2 className="text-lg font-bold">자유게시판</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* 검색 분류 + 화살표 */}
          <div className="relative w-full md:w-auto">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="appearance-none border border-[#31373f] text-sm rounded bg-[#1b1d22] text-white px-2 py-1 pr-8 w-full md:w-auto"
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="nickname">닉네임</option>
              <option value="content">내용</option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs">
              ▼
            </div>
          </div>

          {/* 검색어 입력 */}
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 text-sm bg-[#1b1d22] border border-[#31373f] rounded text-white w-full md:w-48"
          />

          {/* 글쓰기 버튼 */}
          {nickname && (
            <Link
              to="/board/write"
              className="px-3 py-1 text-sm rounded bg-[#31373f] text-white hover:bg-[#3f454f] text-center whitespace-nowrap order-3"
            >
              글쓰기
            </Link>
          )}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-4">
        {["all", "잡담", "정보", "기타"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 text-sm rounded ${
              categoryFilter === cat ? "bg-blue-600 text-white" : "bg-[#1b1d22] text-[#cecfd4]"
            }`}
          >
            {cat === "all" ? "전체" : cat}
          </button>
        ))}
      </div>

      {/* 게시물 리스트 */}
      <div className="border border-[#31373f] rounded">
        {currentPosts.length === 0 ? (
          <div className="p-4 text-sm text-[#aaa]">
            {searchTerm ? "검색 결과가 없습니다." : "등록된 글이 없습니다."}
          </div>
        ) : (
          currentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/board/${post.id}`}
              className="block px-4 py-3 border-b border-[#25272c] hover:bg-[#1b1d22]"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-sm text-[#f7f7f7]">{post.title}</span>
                <span className="text-xs text-[#888] mt-1 sm:mt-0">
                  {post.createdAt?.toDate().toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div className="text-xs text-[#aaa] mt-1">by {post.writer}</div>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-[#1b1d22] text-[#cecfd4]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;