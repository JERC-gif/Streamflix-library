export default function RatingStars({ rating, size = 'medium' }) {
  if (!rating && rating !== 0) {
    return <span className="rating-empty">Sin calificar</span>;
  }

  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = (rating % 2) >= 1;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const getColor = (rating) => {
    if (rating >= 8) return 'var(--success)';
    if (rating >= 6) return 'var(--warning)';
    if (rating >= 4) return '#ff9500';
    return 'var(--error)';
  };

  return (
    <div className={`rating-stars ${size}`}>
      <div className="rating-bar">
        <div
          className="rating-fill"
          style={{
            width: `${rating * 10}%`,
            background: getColor(rating)
          }}
        />
      </div>
      <span className="rating-value" style={{ color: getColor(rating) }}>
        {rating}
      </span>
      <div className="stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </div>
    </div>
  );
}
