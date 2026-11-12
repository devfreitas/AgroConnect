import Constants from 'expo-constants';

type AppExtra = { commitHash?: string };

/** Dados do app lidos da configuração gerada no build (app.json + app.config.js). */
export const appInfo = {
  name: Constants.expoConfig?.name ?? 'AgroConnect',
  version: Constants.expoConfig?.version ?? '—',
  commitHash: (Constants.expoConfig?.extra as AppExtra | undefined)?.commitHash ?? 'desconhecido',
};
