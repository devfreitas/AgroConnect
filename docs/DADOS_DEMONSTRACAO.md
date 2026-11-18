# Dados de demonstração

O app não tem dados fictícios dentro dele. Tudo vem da API, que lê do banco. O IoT é conceitual: os "sensores" são registros inseridos no banco e as leituras têm `simulatedData: true`, o que faz o app exibir o aviso "Dados simulados".

Uma conta nova (criada pelo cadastro do app) começa **vazia**: sem propriedades, dispositivos, leituras ou alertas. Há dois caminhos para ter dados.

## Caminho 1: script (recomendado)

O script `scripts/popular-dados-demo.ps1` entra na conta indicada e cadastra os dados pelas rotas da própria API (não mexe no banco direto):

- 1 propriedade, 2 talhões e 1 plantio (Alface)
- 2 dispositivos: um **online** e um **offline**
- 5 sensores e 24 horas de leituras (umidade do solo, temperatura, umidade do ar, luminosidade)
- 1 leitura com falha de sensor e 1 não calibrada
- 1 alerta de severidade `WARNING`

```powershell
.\scripts\popular-dados-demo.ps1 -Email voce@exemplo.com
```

Ele pede a senha da conta. A primeira chamada pode levar cerca de 1 minuto (o Render hiberna), e os 96 envios de leitura levam mais um pouco. Depois, abra o app, entre com a mesma conta e puxe a tela para atualizar.

Os horários são relativos a "agora". O status do dispositivo é calculado pela última comunicação: online até 5 minutos, instável até 30, depois offline. Por isso, **rode o script pouco antes de apresentar**. Para renovar, rode de novo: ele cria um novo conjunto, com códigos de dispositivo novos. As propriedades antigas podem ser excluídas pelo app.

Depois de rodar, gere recomendações em Análises > Recomendações: o backend só gera recomendação para dispositivos que têm alertas, e a IA pode levar alguns segundos.

## Caminho 2: conta de demonstração criada pelo backend

O backend Java tem um modo de provisionamento: com o perfil `bootstrap` e as variáveis `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD` e `DEMO_DATA_ENABLED=true`, ele cria a conta de demonstração com os mesmos dados acima (dispositivos `ESP32-001` e `ESP32-002`). Quem faz isso é o time de back-end, no Render, e depois deve retirar o perfil e as senhas de provisionamento. Os horários também são relativos ao momento em que o seed roda.
