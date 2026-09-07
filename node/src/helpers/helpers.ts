export const errorSession = () => {
  localStorage.clear();
  globalThis.location.href = "/login";
};
