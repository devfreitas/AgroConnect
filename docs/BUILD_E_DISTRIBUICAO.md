# Build e distribuição (Android)

Gera o APK com o EAS Build e distribui pelo Firebase App Distribution. Somente Android.

## Antes de começar

- Conta Expo e o repositório com o último commit enviado (`git push`).
- Projeto no Firebase com um app Android cujo **ID do pacote** seja `com.devfreitas.agroconnect` (o mesmo de `android.package` no `app.json`).
- As duas APIs no ar no Render, com URLs https.

> `google-services.json` **não é necessário** para o App Distribution. Ele só entra se o app passar a usar o Firebase dentro do código (por exemplo, notificações push com FCM).

## 1. Hash do commit na tela "Sobre o App"

O hash é lido no build, a partir do commit atual. Por isso:

1. Faça o commit final.
2. Gere o build **sem alterar mais nenhum arquivo**. Se a tela mostrar `-alterado`, ainda há arquivos sem commit.

## 2. Variáveis de ambiente do build

O `.env` local não vai para o build na nuvem. Cadastre as URLs no EAS (elas são públicas, não são segredos):

```bash
npx eas-cli@latest login

npx eas-cli@latest env:create --name EXPO_PUBLIC_API_URL \
  --value https://SEU-SERVICO-API.onrender.com/api/v1 \
  --environment preview --visibility plaintext

npx eas-cli@latest env:create --name EXPO_PUBLIC_AI_API_URL \
  --value https://SEU-SERVICO-IA.onrender.com/api/v1 \
  --environment preview --visibility plaintext
```

Nunca cadastre senhas, tokens ou chaves em variáveis `EXPO_PUBLIC_*`: elas ficam embutidas no APK.

## 3. Gerar o APK

```bash
npx eas-cli@latest init            # só na primeira vez: vincula o projeto à conta Expo
npx eas-cli@latest build --platform android --profile preview
```

O perfil `preview` (`eas.json`) gera um **APK** de distribuição interna. Ao terminar, baixe o arquivo pelo link do EAS.

## 4. Distribuir pelo Firebase App Distribution

Pelo console do Firebase: **App Distribution → Distribuir → enviar o `.apk` → escolher testadores ou grupo → Distribuir**.

Pela linha de comando:

```bash
npm install -g firebase-tools
firebase login
firebase appdistribution:distribute ./agroconnect.apk \
  --app ID_DO_APP_NO_FIREBASE \
  --groups "testers" \
  --release-notes "Versão de entrega da Global Solution"
```

O `ID_DO_APP_NO_FIREBASE` aparece em **Configurações do projeto → Seus apps** (formato `1:123456789:android:abc...`). Os testadores recebem um e-mail com o link de instalação.

## 5. Conferir antes de entregar

- [ ] O app abre, e o login funciona contra a API no Render (a primeira chamada pode levar até 60 s se o serviço estiver hibernando).
- [ ] A tela "Sobre o App" mostra o hash do commit final, sem `-alterado`.
- [ ] Os horários dos dados fictícios foram atualizados para "agora" (senão os dispositivos aparecem offline).
- [ ] O link do vídeo do YouTube está no `README.md`.
