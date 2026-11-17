# AgroConnect: contrato de API esperado pelo app mobile

**Status:** o Backend entregou a API Java ( Spring Boot, `https://terrabyte-m1et.onrender.com`) e este documento foi conferido com o código dela: rotas, DTOs, erros e autenticação batem. O teste de ponta a ponta no aparelho ainda será feito.

## 1. APIs

| API | Responsabilidade | Variável no app |
|---|---|---|
| API principal (Java, Spring Boot) | Autenticação, CRUD, dispositivos, leituras, histórico, alertas e recomendações | `EXPO_PUBLIC_API_URL` |
| Recomendações | Rota `POST /recommendations` da própria API principal, que consulta o microsserviço de IA (Spring AI) por baixo, via Eureka e OpenFeign. O app só fala com a API principal | `EXPO_PUBLIC_AI_API_URL` (opcional; padrão: a mesma URL) |

O app nunca acessa banco, broker MQTT nem dispositivo.

## 2. Convenções

- Prefixo `/api/v1`. JSON.
- Erros de validação chegam como `400` (`VALIDATION_ERROR`) com `details` (mapa campo → mensagem). Excesso de tentativas de login: `429` (`RATE_LIMITED`).
- Criações idênticas repetidas são deduplicadas pelo backend (idempotência; também aceita o cabeçalho `Idempotency-Key`).
- O app normaliza datas com muitas casas decimais nos segundos.
- Datas em ISO 8601 **UTC com sufixo `Z`**. IDs em **UUID** (string).
- Autenticação do usuário: `Authorization: Bearer <accessToken>`.
- Paginação nas listas: query `page` (começa em 1) e `size` (padrão 20, máximo 100).

```json
{
  "items": [],
  "page": { "number": 1, "size": 20, "totalItems": 0, "totalPages": 1 }
}
```

- Erros (4xx/5xx), com a mensagem em português para exibição direta ao usuário:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Os dados enviados são inválidos.",
  "details": { "name": "Informe o nome da propriedade." },
  "timestamp": "2026-11-09T13:00:00Z"
}
```

- Nunca retornar segredos. Em erros 5xx o app mostra uma mensagem genérica e ignora o `message`.
- Códigos usados pelo app: 400/422 validação, 401 sessão inválida, 403 sem permissão, 404 não encontrado, 409 conflito.
- Autorização por usuário e propriedade no servidor. Item de outro usuário deve responder 404.

## 3. Saúde

`GET /actuator/health` (sem autenticação). Usado para "acordar" o Render antes da avaliação: os três serviços (API, IA e Eureka) hibernam no plano gratuito.

## 4. Autenticação (API Java)

| Método e rota | Corpo | Resposta |
|---|---|---|
| `POST /auth/register` | `{ name, email, password }` | `201` AuthResponse |
| `POST /auth/login` | `{ email, password }` | `200` AuthResponse |
| `GET /auth/me` | | `200` User |
| `POST /auth/logout` | | `204` |

```json
{
  "accessToken": "…",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": { "id": "uuid", "name": "…", "email": "…", "createdAt": "…" }
}
```

- Cadastro: nome ≥ 2 caracteres, e-mail válido, senha ≥ 8. E-mail repetido → `409`.
- Login inválido → `401` com `"E-mail ou senha inválidos."`.
- Refresh de token: opcional. Se existir, avisar o Mobile.
- As recomendações usam o mesmo JWT, pois estão na mesma API.

## 5. Propriedades (CRUD completo, obrigatório)

| Método e rota | Corpo | Resposta |
|---|---|---|
| `GET /properties` | | `200` Page de Property |
| `POST /properties` | PropertyInput | `201` Property |
| `GET /properties/{id}` | | `200` Property |
| `PATCH /properties/{id}` | campos parciais | `200` Property |
| `DELETE /properties/{id}` | | `204` |

```json
{
  "id": "uuid",
  "name": "Sítio Boa Esperança",
  "city": "Ibiúna",
  "state": "SP",
  "areaHectares": 3.5,
  "description": "texto opcional ou null",
  "createdAt": "…",
  "updatedAt": "…"
}
```

Validação: `name`, `city` ≥ 2 caracteres; `state` com 2 letras; `areaHectares` > 0. A exclusão remove em cascata talhões, plantios, dispositivos vinculados e alertas.

## 6. Talhões e plantios

| Método e rota | Corpo |
|---|---|
| `GET /properties/{id}/fields` | |
| `POST /properties/{id}/fields` | `{ name, areaHectares }` |
| `GET /fields/{id}` | |
| `GET /fields/{id}/plantings` | |
| `POST /fields/{id}/plantings` | `{ cropName, plantedAt, stage }` |

`stage`: `SEEDLING`, `VEGETATIVE`, `MATURATION`, `HARVEST`.

## 7. Dispositivos, leituras e histórico (API Java)

| Método e rota | Observação |
|---|---|
| `GET /devices` | Filtro opcional `fieldId` |
| `GET /devices/{id}` | |
| `GET /devices/{id}/sensors` | |
| `GET /devices/{id}/readings/latest` | Última leitura de cada sensor |
| `GET /devices/{id}/readings` | Query: `type` ou `sensorId` (obrigatório um dos dois), `from`, `to`, `interval` |

```json
{
  "id": "uuid",
  "code": "ESP32-001",
  "name": "Sensor do Canteiro de Alface",
  "fieldId": "uuid",
  "status": "ONLINE",
  "lastSeenAt": "…",
  "rssi": -61,
  "firmwareVersion": "1.0.0"
}
```

- `status` (`ONLINE`, `UNSTABLE`, `OFFLINE`, `UNKNOWN`) é **calculado pelo backend** a partir da última comunicação.
- `GET /devices/{id}/sensors` retorna `Page<Sensor>` (`{ id, deviceId, type, label, unit }`), como as demais listas.
- `readings/latest` → `{ deviceId, recordedAt, readings: [{ sensorId, type, value, unit, quality, recordedAt }], simulatedData }`.
- `type`: `SOIL_MOISTURE`, `AIR_TEMPERATURE`, `AIR_HUMIDITY`, `LIGHT_ILLUMINANCE`.
- `quality`: `VALID`, `OUT_OF_RANGE`, `SENSOR_ERROR`, `UNCALIBRATED`.
- Sem leitura válida: `value: null` com a qualidade correspondente. **Nunca zero.**
- `interval`: `raw`, `5m`, `15m`, `1h`, `1d`. Período padrão: últimas 24 h.

```json
{
  "deviceId": "uuid",
  "sensorId": "uuid",
  "type": "SOIL_MOISTURE",
  "unit": "%",
  "interval": "1h",
  "items": [
    { "timestamp": "…", "value": 27.4, "min": 26.9, "max": 28.0, "sampleCount": 4, "quality": "VALID" }
  ],
  "summary": { "min": 24.1, "max": 30.2, "avg": 27.0 },
  "simulatedData": true
}
```

Períodos sem dados **não geram item** (o app mostra como lacuna).

## 8. Alertas (API Java)

| Método e rota | Resposta |
|---|---|
| `GET /alerts` (filtro opcional `status`) | Page de Alert, ordenada por severidade e data |
| `PATCH /alerts/{id}/read` | `200` Alert |

```json
{
  "id": "uuid",
  "deviceId": "uuid",
  "severity": "WARNING",
  "status": "UNREAD",
  "title": "Umidade do solo abaixo do esperado",
  "message": "texto informativo, sem alarmismo",
  "reason": "explicação da causa",
  "basedOn": [{ "type": "SOIL_MOISTURE", "value": 24.5, "unit": "%", "recordedAt": "…" }],
  "createdAt": "…"
}
```

`severity`: `INFO`, `WARNING`, `CRITICAL`. `status`: `UNREAD`, `READ`, `RESOLVED`.

## 9. Recomendações (IA generativa, atrás da API principal)

`POST /recommendations` com `{ "deviceId": "uuid" }` → `200` Page de Recommendation.

```json
{
  "id": "uuid",
  "generatedAt": "…",
  "priority": "WARNING",
  "title": "Umidade do solo abaixo do esperado",
  "message": "…",
  "reason": "…",
  "basedOn": [{ "type": "SOIL_MOISTURE", "value": 24.5, "unit": "%", "recordedAt": "…" }],
  "disclaimer": "Recomendação informativa baseada em dados simulados. Avalie as condições reais antes de decidir.",
  "simulatedData": true
}
```

- Sempre explicável: `reason`, `basedOn` e `disclaimer` obrigatórios.
- Linguagem informativa ("vale avaliar a irrigação"), nunca ordem de ação.
- Sem limite universal de umidade: os limites dependem de cultura, fase e solo (parâmetros a definir pelo time de IoT/IoB).
- A resposta pode demorar. O app tem timeout de 60 s e indicador de carregamento.
- Nenhuma recomendação aciona equipamento.
- Só há recomendação para dispositivos que têm alertas: sem alertas, a resposta é uma página vazia (`items: []`) e o app mostra o estado vazio.
- O backend guarda o resultado (cache de ~30 min por alerta). Erros próprios da IA: `409 AI_GENERATION_IN_PROGRESS`, `429 AI_BUSY`, `503 AI_UNAVAILABLE` e `AI_NOT_CONFIGURED`, `502 AI_INVALID_RESPONSE`. O app mostra a mensagem em português enviada pelo servidor.

## 9.1 Notificações push (API Java)

| Método e rota | Corpo | Resposta |
|---|---|---|
| `POST /me/push-tokens` | `{ "token": "ExponentPushToken[...]", "platform": "android" }` | `204` ou `200` |

- O app envia o token logo após o login, se o usuário permitir notificações. A chamada deve ser **idempotente** (mesmo token, mesmo usuário: atualiza, não duplica).
- O backend envia a notificação pela [API de push da Expo](https://docs.expo.dev/push-notifications/sending-notifications/) (`https://exp.host/--/api/v2/push/send`), quando criar um alerta.
- Payload sugerido: `{ "to": "<token>", "title": "...", "body": "...", "channelId": "alerts", "data": { "screen": "alerts", "alertId": "uuid" } }`. Texto informativo, sem alarmismo. O app abre a lista de alertas ao tocar.
- `POST /auth/logout` deve invalidar os tokens de push do usuário naquele aparelho.
- Falha ao registrar o token **não** afeta o uso do app: o registro é tentado de novo no próximo acesso.
- Não funciona no emulador nem no Expo Go: só no APK gerado pelo EAS, com as credenciais FCM configuradas (ver `docs/BUILD_E_DISTRIBUICAO.md`).

## 10. Origem dos dados

- Banco: PostgreSQL, schema `agroconnect`. O mobile nunca o acessa, só as APIs.
- Não há IoT funcional nem simulador. Os dados dos sensores são fictícios e foram cadastrados manualmente pela equipe.
- Consequência: a última leitura não avança sozinha. O status do dispositivo (`ONLINE`, `UNSTABLE`, `OFFLINE`), calculado pela última comunicação, só aparece como online se os `recorded_at` forem recentes. **Atualizar os timestamps para "agora" antes da demonstração e da gravação do vídeo.**
- Toda resposta com leituras deve trazer `simulatedData: true`, e o app exibe um aviso de dados de demonstração.
- Cenários cadastrados: dispositivos `ESP32-001` e `ESP32-002`, dispositivo offline, sensor com falha (`SENSOR_ERROR`), leitura não calibrada (`UNCALIBRATED`) e intervalo sem leituras. O app trata cada um como estado de interface.
- Fora do app por ora: refresh de token, recuperação de senha, atualização e exclusão de talhões e plantios, `ai_interactions` e `weather_history`.
