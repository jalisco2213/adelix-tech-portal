import { PersistentStateRef } from '@maddsua/es-state';
export const editorSession = new PersistentStateRef<any>(null, 'editor_session', 'localStorage');