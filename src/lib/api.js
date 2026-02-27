import axios from 'axios';

const API_BASE = 'https://utils.leiro.dev';

const api = axios.create({
  baseURL: API_BASE,
});

export function storageUrl(path) {
  if (!path) return null;
  return `${API_BASE}/storage/${path}`;
}

export async function fetchPosts({ page = 1, category, search } = {}) {
  const params = { page };
  if (category) params.category = category;
  if (search) params.search = search;
  const { data } = await api.get('/posts', { params });
  return data;
}

export async function fetchPost(slug) {
  const { data } = await api.get(`/posts/${slug}`);
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data;
}

export async function trackView(slug) {
  try {
    await api.post('/analytics/track', { slug });
  } catch {
    // fire-and-forget
  }
}

export async function trackPageView(path) {
  try {
    await api.post('/analytics/page-view', { path });
  } catch {
    // fire-and-forget
  }
}

export async function trackLinkClick(code, utmParams = {}) {
  try {
    await api.post('/analytics/link-click', { code, ...utmParams });
  } catch {
    // fire-and-forget
  }
}
