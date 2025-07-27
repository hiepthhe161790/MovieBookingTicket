import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiFillStar, AiOutlineStar, AiOutlineEdit, AiOutlineDelete, AiOutlineUser, AiOutlineMore } from "react-icons/ai";

const StarRating = ({ value, onChange, size = 28, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[1,2,3,4,5].map(star => {
        const filled = hover ? star <= hover : star <= value;
        return (
          <span
            key={star}
            style={{ cursor: readOnly ? "default" : "pointer", fontSize: size, color: "#e4d804" }}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange && onChange(star)}
            data-testid={`star-${star}`}
          >
            {filled ? <AiFillStar /> : <AiOutlineStar />}
          </span>
        );
      })}
    </div>
  );
};

const MovieReview = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [openMenuId, setOpenMenuId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = () => {
    fetch(`http://localhost:8080/api/reviews?movieId=${movieId}`)
      .then(res => res.json())
      .then(setReviews);
    fetch(`http://localhost:8080/api/reviews/average?movieId=${movieId}`)
      .then(res => res.json())
       .then(data => {
        setAverage(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }); 
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const url = editing
    ? `http://localhost:8080/api/reviews/${editing.reviewId}`
    : "http://localhost:8080/api/reviews";

  const method = editing ? "PUT" : "POST";

  const body = editing
    ? {
        rating: form.rating,
        comment: form.comment,
      }
    : {
        movieId,
        accountId: user?.accountId,
        rating: form.rating,
        comment: form.comment,
      };

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Xử lý lỗi từ backend nếu có
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "Có lỗi xảy ra");
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Có lỗi xảy ra");
      }
    }

    toast.success(editing ? "Sửa đánh giá thành công" : "Gửi đánh giá thành công");

    // Reset form
    setForm({ rating: 5, comment: "" });
    setEditing(null);

    // Refresh danh sách đánh giá
    fetchReviews();

  } catch (error) {
    console.error("Error submitting review:", error);
    toast.error(error.message || "Có lỗi xảy ra");
  } finally {
    setLoading(false);
  }
};
  const handleDelete = (reviewId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đánh giá này?")) return;
    fetch(`http://localhost:8080/api/reviews/${reviewId}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error();
        toast.success("Xóa đánh giá thành công");
        fetchReviews();
      })
      .catch(() => toast.error("Xóa đánh giá thất bại"));
  };

  const handleEdit = (review) => {
    setEditing(review);
    setForm({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm({ rating: 5, comment: "" });
  };

  return (
    <div className="movie-review" style={{
      background: "#181818",
      color: "#fff",
      borderRadius: 16,
      padding: 32,
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
    }}>
     <h3
  style={{
    color: "#e4d804",
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    display: "flex",
    alignItems: "center", 
  }}
>
  <AiFillStar style={{ color: "#e4d804", marginRight: 8 }} />
  Đánh giá phim
</h3>

      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 600 }}>Điểm trung bình:</span>
        <StarRating value={average || 0} readOnly size={24} />
        <span style={{ color: "#e4d804", fontWeight: 700, fontSize: 18 }}>
          {average ? average.toFixed(1) : "Chưa có"} / 5
        </span>
            <span style={{ color: "#aaa", fontWeight: 500, fontSize: 16 }}>
          ({totalReviews} đánh giá)
        </span>
      </div>
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <StarRating
            value={form.rating}
            onChange={rating => setForm({ ...form, rating })}
            size={28}
          />
          <input
            type="text"
            placeholder="Nhận xét của bạn"
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            required
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #333",
              background: "#222",
              color: "#fff"
            }}
          />
          <button
            type="submit"
            className="btn"
            style={{
              background: "#e4d804",
              color: "#181818",
              padding: "10px 24px",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 16,
              transition: "background 0.2s"
            }}
            disabled={loading}
          >
            {editing ? "Cập nhật" : "Gửi"}
          </button>
          {editing && (
            <button type="button" onClick={handleCancelEdit} style={{
              marginLeft: 8,
              background: "#444",
              color: "#fff",
              borderRadius: 6,
              padding: "10px 18px",
              fontWeight: 600
            }}>
              Hủy
            </button>
          )}
        </form>
      ) : (
        <div style={{ marginBottom: 24, color: "#ccc" }}>
          Bạn cần đăng nhập để đánh giá phim.
        </div>
      )}
      <div>
        {reviews.length === 0 && <div>Chưa có đánh giá nào.</div>}
        {reviews.map(review => (
          <div key={review.reviewId} style={{
            borderBottom: "1px solid #333",
            padding: "16px 0",
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            position: "relative"
          }}>
            <div style={{
              background: "#222",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#e4d804"
            }}>
              <AiOutlineUser />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong>{review.accountName || `User #${review.accountId}`}</strong>
                  <span style={{ color: "#e4d804", fontWeight: 700, display: "flex", alignItems: "center" }}>
                    <AiFillStar style={{ marginRight: 2 }} /> {review.rating}
                  </span>
                </div>
                {user && review.accountId === user.accountId && (
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === review.reviewId ? null : review.reviewId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e4d804",
                        fontSize: 22,
                        cursor: "pointer",
                        padding: 4
                      }}
                      aria-label="More actions"
                    >
                      <AiOutlineMore />
                    </button>
                    {openMenuId === review.reviewId && (
                      <div
                        style={{
                          position: "absolute",
                          top: 28,
                          right: 0,
                          background: "#222",
                          border: "1px solid #333",
                          borderRadius: 6,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          zIndex: 10,
                          minWidth: 100
                        }}
                      >
                        <button
                          onClick={() => {
                            handleEdit(review);
                            setOpenMenuId(null);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            width: "100%",
                            background: "none",
                            border: "none",
                            color: "#e4d804",
                            padding: "8px 16px",
                            cursor: "pointer"
                          }}
                        >
                          <AiOutlineEdit /> Sửa
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(review.reviewId);
                            setOpenMenuId(null);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            width: "100%",
                            background: "none",
                            border: "none",
                            color: "#ff4d4f",
                            padding: "8px 16px",
                            cursor: "pointer"
                          }}
                        >
                          <AiOutlineDelete /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ margin: "6px 0 10px 0", color: "#eee" }}>{review.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieReview;