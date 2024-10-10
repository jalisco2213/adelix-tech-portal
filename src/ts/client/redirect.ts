import { editorSession } from './state';

export const applyRedirects = async () => {
	if (typeof window !== 'object') {
		return;
	}

	const { value: sessionData } = editorSession;

	const { pathname } = window.location;

	if (!sessionData) {
		if (pathname !== '/') {
			window.location.pathname = '/';
		}
		return;
	}

	if (pathname === '/') {
		window.location.pathname = '/storage';
	}
};