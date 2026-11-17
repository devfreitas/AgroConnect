# AgroConnect

![Expo](https://img.shields.io/badge/Expo-C46B38?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-C46B38?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-C46B38?style=for-the-badge&logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-C46B38?style=for-the-badge&logo=axios&logoColor=white)

O **AgroConnect** é um aplicativo mobile de apoio a pequenos produtores rurais. Ele mostra as condições da plantação (umidade do solo, temperatura, umidade do ar e luminosidade), avisa quando algo foge do esperado e entrega recomendações informativas geradas por inteligência artificial, sempre com o motivo e as leituras usadas.

Projeto da Global Solution 2026/2 (Mobile Application Development), FIAP.

> Os dados dos sensores são **simulados**: o IoT é apenas conceitual e não há protótipo físico. As recomendações são informativas e **nenhuma funcionalidade aciona irrigação** ou qualquer equipamento.

## Funcionalidades Principais

### Acesso
- **Cadastro e Login:** autenticação real com JWT emitido pela API Java. A sessão fica salva no aparelho.
    - *Rotas protegidas:* sem sessão, só as telas de acesso existem.

### Painel do Produtor
- **Início:** resumo com dispositivos online, alertas não lidos, hectares cadastrados e as últimas leituras dos sensores.
- **Plantação (CRUD completo):** propriedades com listagem, detalhe, cadastro, edição e exclusão com confirmação, sempre pela API.
- **Sensores:** lista de dispositivos com estado (online, instável, offline), detalhe com sensores e última leitura.
- **Análises:**
    - **Histórico:** leituras por período, com filtros e gráfico de linha.
    - **Alertas:** avisos por severidade, com o motivo de cada um.
    - **Recomendações da IA:** geradas sob demanda a partir dos alertas e leituras do dispositivo.
- **Notificações de alertas:** o app registra o token do aparelho no backend (`POST /me/push-tokens`) com `expo-notifications`. Tocar na notificação abre Alertas.
- **Perfil:** dados da conta, preferência de notificações e sair.
- **Sobre o App:** versão e hash do commit da build.

### Uso offline (básico)
A última resposta de cada tela é salva no aparelho e exibida com o aviso "Atualizado em…" e "Sem conexão". O cache é apagado ao sair da conta.

## Arquitetura e Tecnologias

- **Core:** React Native com Expo (SDK 58).
- **Linguagem:** TypeScript.
- **Navegação:** React Navigation 7 (native stack e bottom tabs): 5 abas, uma pilha por aba, com barra de abas flutuante própria.
- **Consumo da API:** Axios, com dois clientes (principal e recomendações, ambos apontando hoje para a API Java).
- **Formulários:** React Hook Form e Zod (validação e mensagens em português).
- **Persistência:** `expo-secure-store` para o token JWT e AsyncStorage para o cache de leitura offline.
- **Autenticação:** JWT (`Authorization: Bearer <token>`) anexado pelo interceptor do Axios (`httpClient.ts`). Um 401 encerra a sessão.
- **Gráficos:** `react-native-svg` (gráfico de linha próprio, sem biblioteca de charts).
- **Notificações:** `expo-notifications`.
- **Versão publicada:** a tela "Sobre o App" (Perfil → Sobre o App) exibe a versão e o hash do commit, lidos em tempo de build por `app.config.js`.
- **Qualidade:** TypeScript estrito, Prettier e EditorConfig.

### Backend
O app conversa **apenas** com a API Java (Spring Boot), hospedada no Render, nunca com o banco. A API usa Oracle e consulta um microsserviço de IA (Spring AI com OpenAI) por trás. Documentação da API: [Swagger](https://terrabyte-m1et.onrender.com/swagger-ui/index.html).

> O Render hiberna serviços gratuitos: a primeira chamada pode levar cerca de 1 minuto. O timeout do app é de 60 s.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- npm.
- Aplicativo **Expo Go** no celular ou emulador Android configurado. (Notificações push só funcionam no APK.)

### Configuração (Variáveis de Ambiente)
Crie um arquivo `.env` na raiz do projeto a partir do exemplo:

```env
EXPO_PUBLIC_API_URL=https://terrabyte-m1et.onrender.com/api/v1
# Opcional: só se a IA ficar em outra URL
# EXPO_PUBLIC_AI_API_URL=
```

Variáveis `EXPO_PUBLIC_*` são embutidas no app. **Nunca coloque segredos nelas.** O `.env` não é versionado.

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/devfreitas/AgroConnect.git
   cd AgroConnect
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o `.env` (`cp .env.example .env`; no PowerShell: `Copy-Item .env.example .env`).

### Execução
- `npm start`: inicia o Expo (QR Code para o Expo Go).
- `npm run android`: inicia no emulador Android.

### Qualidade de código
- `npm run typecheck`: verificação de tipos (inclui variáveis não usadas).
- `npm run format`: formata o código com Prettier.
- `npm run format:check`: confere a formatação sem alterar arquivos.

## Autenticação e Avaliação do CRUD

1. **Cadastro e Login:** crie uma conta na tela de cadastro (nome, e-mail e senha) e entre. O token JWT é guardado no SecureStore.
2. **Dados de demonstração:** contas novas começam vazias. Rode o script da próxima seção para popular a conta.
3. **CRUD de propriedades:** em *Plantação*, use "Nova propriedade" (Create), a lista e o detalhe (Read), "Editar" (Update) e "Excluir" com confirmação (Delete).

## Script de Dados de Demonstração (mocks)

Os dados dos sensores são fictícios e ficam **no banco da API**, não no app: o app só os consome pela API, como em produção. O script `scripts/popular-dados-demo.ps1` cadastra esses dados na conta indicada, usando as rotas da própria API.

### Como executar

Crie a conta pelo app e, no PowerShell, na raiz do projeto:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\popular-dados-demo.ps1 -Email seu@email.com
```

A primeira linha só libera a execução de scripts naquela janela do PowerShell. O script pede a senha da conta (sem exibi-la). Depois, abra o app, entre com a mesma conta e puxe a tela para atualizar.

### O que ele faz, na ordem

1. **Login.** Chama `POST /auth/login` com o e-mail e a senha e guarda o token JWT. A conta precisa existir. A primeira chamada pode demorar cerca de 1 minuto, por causa da hibernação do Render.
2. **Define "agora".** Usa o horário atual menos 2 minutos, para a API nunca ver uma leitura "no futuro".
3. **Cria a estrutura.** Tudo vai para a sua conta, pelas rotas da própria API:
    - propriedade "Sítio Boa Esperança" (Ibiúna/SP, 3,5 ha);
    - talhão A "Hortaliças" (1,2 ha) e talhão B "Teste" (0,8 ha);
    - plantio de alface no talhão A (iniciado há 18 dias, fase vegetativa).
4. **Cria os dispositivos.**
    - `ESP32-A<data-hora>`: visto agora, portanto **online**, no talhão A.
    - `ESP32-B<data-hora>`: visto há 3 horas, portanto **offline**, no talhão B.
5. **Cria 5 sensores.** O dispositivo online recebe umidade do solo, temperatura do ar, umidade do ar e luminosidade. O offline recebe só umidade do solo.
6. **Cria 96 leituras.** São 24 horas de leituras, uma por hora, para cada um dos 4 sensores do dispositivo online. Os valores oscilam em torno de uma base: solo ~24,5%, temperatura ~26,2 °C, umidade do ar ~63%, luz ~12.500 lux. Todas são marcadas como simuladas e de qualidade `VALID`.
7. **Cria 2 leituras com problema.** Uma `SENSOR_ERROR` no sensor offline e uma `UNCALIBRATED` no sensor de umidade do solo. Servem para mostrar como o app trata dados ruins.
8. **Cria 1 alerta.** Severidade `WARNING`, "Umidade do solo abaixo do esperado", no dispositivo online. É esse alerta que permite gerar recomendações da IA, porque sem alertas elas vêm vazias.

### Pontos de atenção

- O script **só cria** dados. Rodar de novo na mesma conta gera outro conjunto, com códigos de dispositivo novos, e portanto dados duplicados.
- Os horários são relativos ao momento da execução: o dispositivo aparece online por até 5 minutos, instável por até 30 minutos e depois offline. **Rode o script pouco antes de usar.**
- Mais detalhes em [`docs/DADOS_DEMONSTRACAO.md`](docs/DADOS_DEMONSTRACAO.md).

## Principais Dependências

| Biblioteca | Para que serve |
|---|---|
| `expo` e `react-native` | Base do app e build Android |
| `@react-navigation/*` | Navegação em pilhas e abas |
| `axios` | Cliente HTTP, com interceptor de token e tratamento de erros |
| `react-hook-form` e `zod` (com `@hookform/resolvers`) | Formulários e validação tipada |
| `expo-secure-store` | Token JWT guardado de forma segura |
| `@react-native-async-storage/async-storage` | Cache de leitura offline |
| `react-native-svg` | Gráfico de linha, ícones de marca e fundo do login |
| `expo-notifications`, `expo-device`, `expo-constants` | Push de alertas, identificação do aparelho e informações do app |
| `@expo/vector-icons` | Ícones |
| `react-native-safe-area-context` e `react-native-screens` | Dependências exigidas pela navegação |
| `prettier` (dev) | Formatação padronizada |

Não há bibliotecas de estado global, de gráficos ou de UI: contexto do React, um gráfico em SVG e componentes próprios cobrem o que o app precisa.

## Design System

Identidade visual própria, em tons de terra (terracota, dourado e bege), com tema claro.

- **Tokens:** cores, espaçamentos (`spacing`), arredondamentos (`radius`), tipografia e sombras em `src/theme`.
- **Componentes base (`components/ui`):** `Button`, `Card`, `Input`, `Badge`, `ChipGroup`, `Notice`, `Skeleton`, `EmptyState`, `ErrorState` e outros.
- **Componentes compostos (`components/shared`):** `DeviceCard`, `PropertyCard`, `ReadingCard`, `LineChart`, `AuthLayout`, `StatTile`, entre outros.
- **Acessibilidade:** estados nunca dependem só de cor (ícone e texto), áreas de toque a partir de 44 px, rótulos para leitores de tela e animações que respeitam "reduzir movimento".

## Estrutura do Projeto

```bash
/src
  ├── components/   # ui (base) e shared (compostos)
  ├── contexts/     # AuthContext (sessão)
  ├── hooks/        # useAuth, useRemoteData (busca, cache e atualização), useAutoDismiss
  ├── navigation/   # Root, Auth e App navigators, uma pilha por aba, barra de abas
  ├── screens/      # telas por área (auth, home, plantation, sensors, analytics, profile)
  ├── services/     # clientes Axios, erros, serviços por recurso, cache e token
  ├── theme/        # tokens do Design System e tema de navegação
  ├── types/        # contratos da API, domínio e rotas
  └── utils/        # formatação, períodos, textos de leituras e severidade
```

Separação de responsabilidades: **telas** só montam a interface e chamam hooks e serviços; **serviços** falam com a API e normalizam erros; **hooks** concentram busca, cache e estado; **schemas** (Zod) ficam ao lado das telas que os usam; **tema** concentra todos os valores visuais.

## Fluxo de Navegação

- **Fluxo de Acesso:** Login e Cadastro.
- **Fluxo Autenticado:** 5 abas (Início, Plantação, Sensores, Análises, Perfil), cada uma com sua pilha de telas.

## Build e Distribuição

O APK é gerado com o EAS Build e distribuído pelo Firebase App Distribution. Passo a passo em [`docs/BUILD_E_DISTRIBUICAO.md`](docs/BUILD_E_DISTRIBUICAO.md). O hash do commit exibido em **Perfil → Sobre o App** é lido no momento do build.

## Contrato da API

O app é construído contra [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md), conferido com o código da API Java. Qualquer divergência de rota ou formato se corrige nas funções de `src/services/`.

## Uso de Inteligência Artificial no Desenvolvimento

Declaramos o uso de IA como apoio ao desenvolvimento deste app, em **estilização e refatoração de alguns elementos**. Todo o código foi revisado e validado pelo grupo.

- **Impeccable:** apoio à estilização e ao refinamento da interface (identidade visual, barra de abas flutuante, tela de login e animações).
- **typescript-expert:** apoio à tipagem e à refatoração de código TypeScript (tipos de API e domínio, serviços e hooks).
- **code-reviewer:** apoio à revisão de código (legibilidade, organização e consistência).

A IA **dentro do produto** é outra coisa: as recomendações exibidas ao produtor são geradas pelo serviço de IA do backend, a partir de alertas e leituras, e são sempre informativas.

## Limitações conhecidas

- Listas buscam apenas a primeira página (até 100 itens).
- Criar, editar e excluir exigem conexão; não há fila de envio posterior.
- Sem refresh de token, recuperação de senha e gerenciamento de talhões e plantios no app.
- O backend Java registra o token de push, mas o **envio externo de notificações ainda não está implementado** nele. Push real também exige as credenciais FCM e só funciona no APK, não no Expo Go.

## Link Demonstração

Link do YouTube:

## Link Convite App Distribution

Link do convite do Firebase App Distribution: 

## Autores

Rafael de Freitas Moraes (RM563210) - [GitHub](https://github.com/devfreitas)<br>
Carolina nascimento gonçalves  (RM564786)
<br>
Emanuelly ventura do nascimento  (RM562339)
<br>
Julia Sayuri Kina  (RM564555)
<br>
Rafael Pascotte Mercadante  (RM564928)

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
