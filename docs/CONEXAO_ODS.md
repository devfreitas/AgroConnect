# Conexão com os ODS e visão do projeto
O Agro Connect tem ligação direta com quatro dos ODS da lista. Os outros três só têm ligação indireta, e é melhor dizer isso do que forçar. Um avaliador costuma desconfiar de projeto que marca todos os ODS.

#### ODS conectados
###### ODS 2: Fome zero e agricultura sustentável (principal)
Metas: 2.3 (produtividade e renda de pequenos produtores) e 2.4 (práticas agrícolas resilientes e sustentáveis).
Como contribui: o pequeno produtor decide com dados de umidade do solo, temperatura, umidade do ar e luminosidade, e não só pela experiência ou pelo “olho”. Alertas e recomendações com motivo ajudam a evitar perda de lavoura por falta de água ou por estresse climático.

###### ODS 9: Indústria, inovação e infraestrutura
Metas: 9.5 (pesquisa e inovação) e 9.c (acesso à tecnologia da informação).
Como contribui: leva IoT, nuvem e IA, tecnologias que hoje ficam com a grande agricultura, para um app Android simples, no aparelho que o produtor já tem.

###### ODS 13: Ação contra a mudança global do clima
Metas: 13.1 (resiliência a riscos climáticos) e 13.3 (adaptação e conscientização).
Como contribui: o clima mais instável (seca, calor, chuva fora de época) é um risco real para o produtor. Monitorar as condições da plantação e alertar cedo ajuda na adaptação. A recomendação sempre explica o motivo, o que também educa o produtor.

###### ODS 10: Redução das desigualdades
Meta: 10.2 (inclusão econômica de todos).
Como contribui: o app é voltado ao pequeno produtor, com interface simples, estados que não dependem só de cor, áreas de toque grandes e uso offline básico para áreas de conectividade ruim. Reduz a distância de acesso à tecnologia em relação aos grandes produtores.
Ligações indiretas (cite com cuidado)
###### ODS 3, Saúde e bem-estar:
só por um argumento de segurança alimentar, ou seja, produzir melhor significa alimento disponível. É um efeito distante, não um objetivo do app.
ODS 4, Educação de qualidade: as explicações das recomendações têm função educativa. Não é um projeto educacional.
###### ODS 11, Cidades e comunidades sustentáveis: 
só pelo abastecimento das cidades. Não foi o foco.
Se o enunciado exigir listar todos, deixe claro o grau de ligação (principal, secundário ou indireto).

### Perguntas do projeto
###### Quem é o cidadão beneficiado?
O pequeno produtor rural e a família que depende da lavoura, com pouco acesso a assistência técnica e a tecnologia. Indiretamente, quem consome o que ele produz.

###### Qual problema será resolvido?
O pequeno produtor decide sobre irrigação e manejo sem dados. Falta de água, calor e variações do clima só são percebidos quando o dano já aconteceu. Soluções de monitoramento existem, mas são caras e feitas para grandes propriedades.

###### Como a solução vai funcionar?
- Sensores em campo medem umidade do solo, temperatura, umidade do ar e luminosidade.
As leituras vão para a API, que as guarda no banco e gera alertas quando algo foge do esperado.
No app, o produtor vê o estado dos dispositivos, o histórico em gráfico e os alertas por severidade.
Ao tocar em “Gerar recomendações”, a API envia alertas e leituras ao serviço de IA, que devolve orientações informativas com motivo e dados usados.

###### Limites que você deve declarar:
Os dados são simulados e o IoT é conceitual, sem protótipo físico. O app não aciona irrigação nem equipamento, e a decisão fica com o produtor. O envio de push pelo backend ainda não está implementado.

###### Quais tecnologias serão usadas?
- App: React Native, Expo e TypeScript, com React Navigation, Axios, React Hook Form e Zod.
- Segurança e armazenamento: JWT, SecureStore e AsyncStorage.
- Backend: Java Spring Boot, Oracle, com microsserviço de IA (Spring AI e OpenAI), Eureka e OpenFeign.
- Hospedagem e entrega: Render, EAS Build e Firebase App Distribution.
- Sensores (conceito): microcontroladores como o ESP32, que o script de demonstração já usa nos códigos dos dispositivos.

###### Quem participa do ecossistema?
Produtores rurais (usuários).
- A equipe de desenvolvimento (mobile e backend).
- Fornecedores de sensores e conectividade, em uma versão real.
- Extensionistas e cooperativas, que podem usar o app para orientar vários produtores.
- Órgãos de pesquisa e assistência técnica, como a Embrapa, para validar as recomendações.
- Para escalar: prefeituras e secretarias de agricultura.
Os três últimos são parceiros em potencial, não parcerias existentes. Apresente assim.

###### Como o impacto será medido e ampliado?
Hoje não há medição real, porque os dados são simulados. O que você pode propor é o plano de medição, com indicadores:
- Adoção: produtores ativos e propriedades cadastradas.
- Uso: alertas gerados e lidos, e recomendações geradas.
- Resultado agrícola (em piloto): perda de lavoura evitada, consumo de água por área e produtividade antes e depois.
- Percepção: pesquisa de satisfação e confiança nas recomendações.

###### Para ampliar, a sequência natural é:
- Piloto com poucas propriedades e sensores reais.
- Parceria com cooperativas e extensionistas.
- Novas culturas e regiões, ajustando as faixas de referência por cultivo.
- Push real e conexão com dados de previsão do tempo.