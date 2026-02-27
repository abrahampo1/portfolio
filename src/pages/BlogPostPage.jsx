import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchPost, trackView, storageUrl } from '../lib/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPost(slug)
      .then((data) => {
        const postData = data.data || data;
        setPost(postData);
        if (postData.slug) trackView(postData.slug);
      })
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mt-16">
        <p className="tinos-regular-italic">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mt-16">
        <Link to="/blog" className="tinos-regular-italic hover:underline">&larr; Back to blog</Link>
        <p className="tinos-regular mt-4">{error || 'Post not found.'}</p>
      </div>
    );
  }

  const date = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = post.reading_time || Math.ceil((post.body || '').split(/\s+/).length / 200);
  const imageUrl = post.featured_image ? storageUrl(post.featured_image) : null;

  return (
    <div className="mt-16 max-w-3xl">
      <Link to="/blog" className="tinos-regular-italic hover:underline">&larr; Back to blog</Link>

      <h1 className="text-3xl tinos-bold mt-4">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-2 tinos-regular-italic text-gray-500 mt-2 flex-wrap">
        {post.author && <span>{post.author.name || post.author}</span>}
        {post.author && <div className="w-[1px] bg-gray-500 h-4"></div>}
        <span>{date}</span>
        <div className="w-[1px] bg-gray-500 h-4"></div>
        <span>{readingTime} min read</span>
      </div>

      {/* Categories & Tags */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {post.categories?.map((cat) => (
          <Link
            key={cat.id}
            to={`/blog?category=${cat.slug}`}
            className="text-xs tinos-regular border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors"
          >
            {cat.name}
          </Link>
        ))}
        {post.tags?.map((tag) => (
          <span
            key={tag.id || tag}
            className="text-xs tinos-regular-italic border border-gray-400 text-gray-500 px-2 py-0.5"
          >
            {tag.name || tag}
          </span>
        ))}
      </div>

      {/* Featured Image */}
      {imageUrl && (
        <div className="mt-6 border-black border-1 border-r-3 border-b-3 overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Body */}
      <div className="mt-6 prose-custom tinos-regular">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.body || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
