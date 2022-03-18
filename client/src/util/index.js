export const API_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost/upei-library-journal-project/server/routes`
    : '/routes';

export const downloadFileToClient = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
