const { execSync } = require('node:child_process');

/** Lê o hash curto do commit em que o app está sendo gerado. */
function getCommitHash() {
  if (process.env.EXPO_PUBLIC_COMMIT_HASH) return process.env.EXPO_PUBLIC_COMMIT_HASH;

  try {
    const run = (command) =>
      execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();

    const hash = run('git rev-parse --short HEAD');
    const dirty = run('git status --porcelain') !== '';
    return dirty ? `${hash}-alterado` : hash;
  } catch {
    return 'desconhecido';
  }
}

// Complementa o app.json. O hash vai para `extra` e é exibido na tela "Sobre o App".
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: getCommitHash(),
  },
});
