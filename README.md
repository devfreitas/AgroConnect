# AgroConnect (mobile)

Aplicativo mobile do AgroConnect, plataforma de apoio a pequenos produtores rurais. O produtor acompanha as condições da plantação (umidade do solo, temperatura, umidade do ar e luminosidade), vê alertas e recebe recomendações informativas geradas por inteligência artificial.

Projeto da Global Solution 2026/2 (Mobile Application Development), FIAP. Somente Android.

> Os dados dos sensores são **simulados**: o IoT é apenas conceitual e não há protótipo físico. As recomendações são informativas e **nenhuma funcionalidade aciona irrigação** ou qualquer equipamento.

## Vídeo demonstrativo

_Link do YouTube: a preencher (até 5 minutos)._

## Telas

| Área | Telas |
|---|---|
| Acesso | Login, Cadastro |
| Início | Últimas leituras dos sensores |
| Plantação | Lista de propriedades, detalhe, cadastro e edição, exclusão |
| Sensores | Lista de dispositivos, detalhe com sensores e última leitura |
| Análises | Histórico com filtros e gráfico, alertas, recomendações da IA |
| Perfil | Dados da conta, notificações de alertas, Sobre o App (versão e hash do commit), sair |

O CRUD completo é o de **propriedades** (listar, ver, criar, editar e excluir), sempre pela API.

## Stack

- React Native, TypeScript e Expo (SDK 58)
- React Navigation 7: native stack e bottom tabs (5 abas, uma pilha por aba)
- Axios, com dois clientes: API principal (C#) e API de IA
- React Hook Form e Zod (formulários e validação)
- Expo SecureStore (token e sessão) e AsyncStorage (cache de leitura offline)
- react-native-svg (gráfico de linha)
- expo-notifications (push de alertas, Android)

## Arquitetura

O app conversa apenas com as duas APIs, nunca com o banco. As camadas ficam separadas:

```
src/
├── components/    ui (base) e shared (compostos)
├── contexts/      AuthContext (sessão)
├── hooks/         useAuth, useRemoteData (busca, cache, atualização), useAutoDismiss
├── navigation/    RootNavigator, AuthNavigator, AppNavigator e uma pilha por aba
├── screens/       telas por área (auth, home, plantation, sensors, analytics, profile)
├── services/      clientes Axios, tratamento de erros, serviços por recurso, cache, token
├── theme/         cores, tipografia, espaçamento, tema de navegação
├── types/         contratos da API, domínio e rotas
└── utils/         formatação, períodos, textos de leituras e severidade
```

Decisões principais:

- **Rotas protegidas** por renderização condicional: sem sessão, só as telas de acesso existem.
- **Token** guardado no SecureStore e enviado pelo interceptor do Axios. Um 401 encerra a sessão.
- **Erros** da API são normalizados em um único tipo e exibidos com mensagem em português.
- **Uso offline:** a última resposta de cada tela é salva no aparelho e exibida, com o aviso "Atualizado em…" e "Sem conexão". O cache é apagado ao sair da conta.
- **Acessibilidade:** estados nunca dependem só de cor (ícone e texto), áreas de toque a partir de 44 px, rótulos para leitores de tela.

## Como rodar

```bash
npm install
cp .env.example .env     # no PowerShell: Copy-Item .env.example .env
# edite o .env com as URLs reais das APIs (https)
npx expo start -c
```

Variáveis `EXPO_PUBLIC_*` são embutidas no app. **Nunca coloque segredos nelas.** O `.env` não é versionado.

## Build e distribuição

O APK é gerado com o EAS Build e distribuído pelo Firebase App Distribution. Passo a passo em [`docs/BUILD_E_DISTRIBUICAO.md`](docs/BUILD_E_DISTRIBUICAO.md).

O hash do commit exibido em **Perfil → Sobre o App** é lido no momento do build.

## Contrato da API

O app é construído contra [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md), uma **proposta** a validar com o Backend e a IA. Qualquer divergência de rota ou formato se corrige nas funções de `src/services/`.

## Limitações conhecidas

- Listas buscam apenas a primeira página (até 100 itens).
- Criar, editar e excluir exigem conexão; não há fila de envio posterior.
- Sem refresh de token, recuperação de senha e gerenciamento de talhões e plantios.
- Notificações push dependem do backend (`POST /me/push-tokens` e envio) e das credenciais FCM; só funcionam no APK, não no Expo Go.
