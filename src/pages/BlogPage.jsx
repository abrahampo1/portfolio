import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPosts, fetchCategories } from '../lib/api';
import BlogPostCard from '../components/BlogPostCard';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const currentPage = Number(searchParams.get('page')) || 1;
  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts({
      page: currentPage,
      category: activeCategory || undefined,
      search: activeSearch || undefined,
    })
      .then((data) => {
        setPosts(data.data || []);
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
        });
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [currentPage, activeCategory, activeSearch]);

  // Sync input with URL param when navigating back/forward
  useEffect(() => {
    setSearch(activeSearch);
  }, [activeSearch]);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  }

  const debouncedSearch = useCallback((value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: value || '', page: '' });
    }, 400);
  }, [searchParams]);

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  }

  function clearSearch() {
    setSearch('');
    updateParams({ search: '', page: '' });
    inputRef.current?.focus();
  }

  function clearCategory() {
    updateParams({ category: '', page: '' });
  }

  function clearAllFilters() {
    setSearch('');
    const params = new URLSearchParams();
    setSearchParams(params);
  }

  function handleCategoryClick(categorySlug) {
    updateParams({
      category: activeCategory === categorySlug ? '' : categorySlug,
      page: '',
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateParams({ search: search || '', page: '' });
  }

  function goToPage(page) {
    updateParams({ page: page > 1 ? String(page) : '' });
  }

  const hasFilters = activeSearch || activeCategory;
  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <div className="mt-16">
      <p className="text-3xl tinos-regular">Blog</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mt-4 relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search posts..."
          className="w-full border border-black pl-9 pr-8 py-2 text-sm tinos-regular outline-none focus:border-r-3 focus:border-b-3 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`text-sm tinos-regular px-3 py-1 border border-black transition-colors cursor-pointer ${
                activeCategory === cat.slug ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Active filters */}
      {hasFilters && (
        <div className="mt-3 flex gap-2 flex-wrap items-center">
          <span className="text-xs tinos-regular text-gray-500">Filters:</span>
          {activeSearch && (
            <button
              onClick={clearSearch}
              className="text-xs tinos-regular px-2 py-0.5 bg-gray-100 border border-gray-300 flex items-center gap-1 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              &ldquo;{activeSearch}&rdquo;
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {activeCategory && activeCategoryName && (
            <button
              onClick={clearCategory}
              className="text-xs tinos-regular px-2 py-0.5 bg-gray-100 border border-gray-300 flex items-center gap-1 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {activeCategoryName}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs tinos-regular text-gray-500 hover:text-black underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          <p className="tinos-regular-italic">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="tinos-regular-italic text-gray-500">
              {hasFilters
                ? `No posts found${activeSearch ? ` for "${activeSearch}"` : ''}${activeCategory && activeCategoryName ? ` in ${activeCategoryName}` : ''}.`
                : 'No posts found.'}
            </p>
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-2 text-sm tinos-regular underline text-gray-500 hover:text-black cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => <BlogPostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.lastPage > 1 && (
        <div className="mt-6 flex gap-2 flex-wrap">
          {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`text-sm tinos-regular px-3 py-1 border border-black transition-colors cursor-pointer ${
                page === pagination.currentPage
                  ? 'bg-black text-white border-r-3 border-b-3'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
