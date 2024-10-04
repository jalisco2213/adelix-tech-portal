
export const getRemoteUrl = () => new URL(import.meta.env.PROD ? window.location.href : import.meta.env.VITE_DEVMODE_CF_REMOTE);