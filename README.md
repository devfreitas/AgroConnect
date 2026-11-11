# AgroConnect (mobile)

Aplicativo mobile do AgroConnect, plataforma de apoio a pequenos produtores rurais. Projeto da Global Solution 2026/2 (Mobile Application Development).

> Os dados dos sensores são **simulados**: o IoT é apenas conceitual e não há protótipo físico. Nenhuma funcionalidade aciona irrigação.

## Stack

- React Native, TypeScript e Expo (SDK 58)
- React Navigation (native stack e bottom tabs, com 5 abas)
- Axios (clientes para a API C# e para a API de IA)
- React Hook Form e Zod (formulários)
- Expo SecureStore (token e sessão)

## Como rodar

```bash
npm install
cp .env.example .env     # no PowerShell: Copy-Item .env.example .env
# edite o .env com as URLs reais das APIs (https)
npx expo start -c
```

Variáveis `EXPO_PUBLIC_*` são embutidas no app. Nunca coloque segredos nelas.

## Estrutura

```
src/
├── assets/        fontes, imagens e ícones
├── components/    ui (base) e shared (compostos)
├── contexts/      AuthContext
├── hooks/         useAuth
├── navigation/    RootNavigator, AuthNavigator, AppNavigator
├── screens/       telas (auth, home, plantation, sensors, analytics, profile)
├── services/      Axios, erros, autenticação, armazenamento seguro
├── theme/         cores, tipografia, espaçamento
├── types/         contratos e tipos
└── utils/         funções auxiliares
```

## Contrato da API

O app é construído contra [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md), que é uma **proposta** a validar com o Backend e a IA.

## Vídeo demonstrativo

_Link do YouTube: a preencher._
