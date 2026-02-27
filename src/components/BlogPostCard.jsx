import { Link } from 'react-router-dom';
import { storageUrl } from '../lib/api';

export default function BlogPostCard({ post }) {
  const date = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageUrl = post.featured_image ? storageUrl(post.featured_image) : null;

  return (
    <Link to={`/blog/${post.slug}`} className="block">
      <div className="border-black border-1 border-r-3 border-b-3 flex flex-col sm:flex-row overflow-hidden hover:bg-gray-50 transition-colors">
        {imageUrl && (
          <div className="sm:w-[240px] w-full h-[180px] sm:h-auto shrink-0">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="p-4 flex flex-col justify-center">
          <h2 className="text-xl tinos-bold">{post.title}</h2>
          <p className="text-sm tinos-regular-italic text-gray-500 mt-1">{date}</p>
          {post.excerpt && (
            <p className="tinos-regular text-gray-700 mt-2 line-clamp-2">{post.excerpt}</p>
          )}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {post.categories.map((cat) => (
                <span key={cat.id} className="text-xs tinos-regular border border-black px-2 py-0.5">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
