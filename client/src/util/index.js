export const API_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost/upei-library-journal-project/server/routes`
    : '/routes';
