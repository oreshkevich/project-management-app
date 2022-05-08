export const checkJson = () => {
  try {
    const token = JSON.parse(localStorage.getItem('token') || String(null));
    return token;
  } catch {
    return null;
  }
};
