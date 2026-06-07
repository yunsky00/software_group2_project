const PROFILE_KEY = 'specmoa-profile';
const BOOKMARKS_KEY = 'specmoa-bookmarks';
const RECOMMENDATION_HISTORY_KEY = 'specmoa-recommendation-history';

const defaultProfile = {
  name: '김',
  email: 'user@example.com',
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getProfile() {
  return { ...defaultProfile, ...readJson(PROFILE_KEY, defaultProfile) };
}

export function saveProfile(profile) {
  writeJson(PROFILE_KEY, profile);
}

export function getBookmarks() {
  return readJson(BOOKMARKS_KEY, []);
}

export function isBookmarked(certificateId) {
  return getBookmarks().some((item) => item.id === certificateId);
}

export function toggleBookmark(certificate) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((item) => item.id === certificate.id);
  const nextBookmarks = exists
    ? bookmarks.filter((item) => item.id !== certificate.id)
    : [
        {
          id: certificate.id,
          name: certificate.name,
          organization: certificate.organization,
          category: certificate.category,
          examDate: certificate.examDate,
          level: certificate.level,
        },
        ...bookmarks,
      ];

  writeJson(BOOKMARKS_KEY, nextBookmarks);
  return !exists;
}

export function getRecommendationHistory() {
  return readJson(RECOMMENDATION_HISTORY_KEY, []);
}

export function saveRecommendationHistory(record) {
  const current = getRecommendationHistory();
  const next = [
    {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...record,
    },
    ...current,
  ].slice(0, 10);

  writeJson(RECOMMENDATION_HISTORY_KEY, next);
}
