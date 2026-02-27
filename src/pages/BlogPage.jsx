import { useState, useEffect } from 'react';
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

  const currentPage = Number(searchParams.get('page')) || 1;
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts({
      page: currentPage,
      category: activeCategory || undefined,
      search: searchParams.get('search') || undefined,
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
  }, [currentPage, activeCategory, searchParams]);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
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
    updateParams({ search: search || '', page: '' });
  }

  function goToPage(page) {
    updateParams({ page: page > 1 ? String(page) : '' });
  }

  return (
    <div className="mt-16">
      <p className="text-3xl tinos-regular">Blog</p>

      {/* Filters */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex gap-2 flex-wrap">
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
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="border border-black px-3 py-1 text-sm tinos-regular outline-none focus:border-r-3 focus:border-b-3 transition-all"
          />
          <button
            type="submit"
            className="text-sm tinos-regular px-3 py-1 border border-black bg-white hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Posts */}
      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          <p className="tinos-regular-italic">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="tinos-regular-italic">No posts found.</p>
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
