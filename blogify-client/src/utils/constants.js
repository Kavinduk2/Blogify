export const CATEGORIES = [
  'Technology',
  'Travel',
  'Food',
  'Lifestyle',
  'Health',
  'Business',
  'Entertainment',
  'Other'
];

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};

export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  CONTENT_MIN_LENGTH: 10,
  EXCERPT_MAX_LENGTH: 300
};

export const API_TIMEOUT = 10000; // 10 seconds

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BLOG: '/blog',
  POST_DETAIL: '/blog/:id',
  CREATE_POST: '/create',
  EDIT_POST: '/edit/:id',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com',
  TWITTER: 'https://twitter.com',
  LINKEDIN: 'https://linkedin.com',
  INSTAGRAM: 'https://instagram.com'
};

export const PLACEHOLDER_IMAGES = {
  AVATAR: 'https://via.placeholder.com/150',
  COVER: 'https://via.placeholder.com/800x400',
  POST: 'https://via.placeholder.com/600x400'
};

export default {
  CATEGORIES,
  POST_STATUS,
  USER_ROLES,
  PAGINATION,
  VALIDATION_RULES,
  API_TIMEOUT,
  TOAST_DURATION,
  TOAST_TYPES,
  ROUTES,
  LOCAL_STORAGE_KEYS,
  SOCIAL_LINKS,
  PLACEHOLDER_IMAGES
};
