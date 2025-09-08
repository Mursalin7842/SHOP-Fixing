import React, { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import Button from '../components/Button';
import { addReviewResponse, resolveReport } from '../features/productSlice';

const ReviewsPage = ({ products }) => {
  const dispatch = useDispatch();
  const activeShopId = useSelector(s => s.shops?.activeShopId);
  const [query, setQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all'); // all | 5 | 4 | 3 | 2 | 1
  const [reportStatus, setReportStatus] = useState('open'); // open | resolved | all
  const [productFilter, setProductFilter] = useState('all'); // all | productId
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const PAGE_SIZE = 5;

  const scopedProducts = useMemo(() => (
    Array.isArray(products) ? products.filter(p => !activeShopId || p.shopId === activeShopId) : []
  ), [products, activeShopId]);

  const allReviews = useMemo(() => scopedProducts.flatMap(p => (p.reviews || []).map(r => ({ ...r, productId: p.id, productName: p.name }))), [scopedProducts]);
  const allReports = useMemo(() => scopedProducts.flatMap(p => (p.reports || []).map(r => ({ ...r, productId: p.id, productName: p.name }))), [scopedProducts]);

  const productOptions = useMemo(() => [{ id: 'all', name: 'All products' }, ...scopedProducts.map(p => ({ id: String(p.id), name: p.name }))], [scopedProducts]);

  const filteredReviews = useMemo(() => allReviews.filter(r => {
    if (productFilter !== 'all' && String(r.productId) !== productFilter) return false;
    if (ratingFilter !== 'all' && Number(r.rating) !== Number(ratingFilter)) return false;
    if (query && !(`${r.user} ${r.productName} ${r.comment}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  }), [allReviews, ratingFilter, query, productFilter]);

  const filteredReports = useMemo(() => allReports.filter(r => {
    if (productFilter !== 'all' && String(r.productId) !== productFilter) return false;
    if (reportStatus !== 'all') {
      const isResolved = r.status === 'resolved';
      if (reportStatus === 'open' && isResolved) return false;
      if (reportStatus === 'resolved' && !isResolved) return false;
    }
    if (query && !(`${r.user} ${r.productName} ${r.subject || ''}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  }), [allReports, reportStatus, query, productFilter]);

  const stats = useMemo(() => ({
    avgRating: (allReviews.length ? (allReviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / allReviews.length).toFixed(1) : '0.0'),
    totalReviews: allReviews.length,
    openReports: allReports.filter(r => r.status !== 'resolved').length,
  }), [allReviews, allReports]);

  const ratingDistribution = useMemo(() => {
    const dist = {1:0,2:0,3:0,4:0,5:0};
    for (const r of allReviews) {
      const k = String(r.rating);
      if (dist[k] !== undefined) dist[k]++;
    }
    return dist;
  }, [allReviews]);

  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const totalReportPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const reviewsSlice = filteredReviews.slice((reviewsPage-1)*PAGE_SIZE, reviewsPage*PAGE_SIZE);
  const reportsSlice = filteredReports.slice((reportsPage-1)*PAGE_SIZE, reportsPage*PAGE_SIZE);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-lg shadow-lg card elevated-card">
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-2xl font-bold">Reviews & Reports</h2>
          <div className="flex flex-wrap gap-2">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by user, product, text" className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2 w-56" />
            <select value={productFilter} onChange={e=>{ setProductFilter(e.target.value); setReviewsPage(1); setReportsPage(1); }} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2">
              {productOptions.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            <select value={ratingFilter} onChange={e=>setRatingFilter(e.target.value)} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2">
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <select value={reportStatus} onChange={e=>setReportStatus(e.target.value)} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2">
              <option value="open">Open reports</option>
              <option value="resolved">Resolved</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[var(--surface-2)]">
            <div className="text-sm text-[var(--muted-text)]">Average Rating</div>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface-2)]">
            <div className="text-sm text-[var(--muted-text)]">Total Reviews</div>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface-2)]">
            <div className="text-sm text-[var(--muted-text)]">Open Reports</div>
            <div className="text-2xl font-bold">{stats.openReports}</div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2 text-sm">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="px-2 py-1 rounded bg-[var(--surface-2)] border border-[var(--border-color)]">
                {star}★: {ratingDistribution[star] || 0}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg shadow-lg card elevated-card">
        <div className="p-6 border-b border-[var(--border-color)]"><h3 className="text-xl font-bold">Customer Reviews</h3></div>
        <div className="p-6 space-y-4">
          {filteredReviews.length === 0 && (<div className="text-[var(--muted-text)]">No reviews match your filters.</div>)}
          {reviewsSlice.map(r => (
            <div key={`${r.productId}-${r.id}`} className="p-4 rounded-lg bg-[var(--surface-2)]">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{r.user} on <span className="text-blue-400">{r.productName}</span></div>
                <Rating rating={r.rating} />
              </div>
              <p className="text-sm text-[var(--muted-text)]">{r.comment}</p>
              <div className="mt-3 border-t border-[var(--border-color)] pt-3">
                {r.sellerResponse ? (
                  <div className="text-sm"><span className="text-[var(--muted-text)]">Your reply:</span> {r.sellerResponse.text} <span className="text-[var(--muted-text)]">({r.sellerResponse.date})</span></div>
                ) : (
                  <ReviewReplyForm onSubmit={(text)=> dispatch(addReviewResponse({ productId: r.productId, reviewId: r.id, text }))} />
                )}
              </div>
            </div>
          ))}
          {filteredReviews.length > PAGE_SIZE && (
            <Pagination current={reviewsPage} totalPages={totalReviewPages} onPrev={()=> setReviewsPage(Math.max(1, reviewsPage-1))} onNext={()=> setReviewsPage(Math.min(totalReviewPages, reviewsPage+1))} />
          )}
        </div>
      </div>

      <div className="rounded-lg shadow-lg card elevated-card">
        <div className="p-6 border-b border-[var(--border-color)]"><h3 className="text-xl font-bold">Customer Reports</h3></div>
        <div className="p-6 space-y-4">
          {filteredReports.length === 0 && (<div className="text-[var(--muted-text)]">No reports match your filters.</div>)}
          {reportsSlice.map(r => (
            <div key={`${r.productId}-rep-${r.id}`} className={`p-4 rounded-lg ${r.status==='resolved' ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/30'}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{r.user} reported <span className="text-red-300">{r.productName}</span></p>
                <StatusBadge status={r.status==='resolved' ? 'resolved' : 'open'} />
              </div>
              <p className="text-sm text-[var(--muted-text)] mt-1">Reason: {r.subject}</p>
              {r.status==='resolved' && r.resolutionNote && (
                <p className="text-xs text-green-300 mt-1">Resolution: {r.resolutionNote}</p>
              )}
              {r.status !== 'resolved' && (
                <div className="mt-3"><ResolveReportForm onResolve={(note)=> dispatch(resolveReport({ productId: r.productId, reportId: r.id, note }))} /></div>
              )}
            </div>
          ))}
          {filteredReports.length > PAGE_SIZE && (
            <Pagination current={reportsPage} totalPages={totalReportPages} onPrev={()=> setReportsPage(Math.max(1, reportsPage-1))} onNext={()=> setReportsPage(Math.min(totalReportPages, reportsPage+1))} />
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewReplyForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  return (
    <div className="flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Reply to this review" className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2" />
      <Button color="gray" disabled={!text.trim()} onClick={()=> { onSubmit(text.trim()); setText(''); }}>Reply</Button>
    </div>
  );
};

const ResolveReportForm = ({ onResolve }) => {
  const [note, setNote] = useState('');
  return (
    <div className="flex gap-2">
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a resolution note (optional)" className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2" />
      <Button color="green" onClick={()=> { onResolve(note.trim()); setNote(''); }}>Mark Resolved</Button>
    </div>
  );
};

const Pagination = ({ current, totalPages, onPrev, onNext }) => (
  <div className="flex justify-end items-center gap-2 pt-2">
    <Button color="gray" disabled={current<=1} onClick={onPrev}>Prev</Button>
    <div className="text-sm text-[var(--muted-text)]">Page {current} of {totalPages}</div>
    <Button color="gray" disabled={current>=totalPages} onClick={onNext}>Next</Button>
  </div>
);

export default ReviewsPage;
