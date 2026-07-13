# Guião de Apresentação Oral

Duração estimada: 12-15 minutos

## Slide 1 - Título
Bom dia / Boa tarde, e obrigado por estarem presentes. Chamo-me Gabriel Matias Falcão, e esta apresentação incide sobre o trabalho iniciado no meu estágio de desenvolvimento curricular na GMV, entre 11 de março e 17 de julho de 2026, e continuado depois diretamente na empresa. O trabalho centrou-se no controlo programático de hardware SDR para transmissão de sinais GNSS, e na integração de uma ligação RS-232 através de PPP para transportar o canal de controlo IP e gRPC.

## Slide 2 - Contexto: Porque é que a simulação de sinais GNSS é importante

As constelações GNSS, como o GPS, Galileo, GLONASS e BeiDou, transmitem continuamente sinais de posicionamento. Em fluxos de trabalho de engenharia e validação, não podemos depender de satélites reais, de condições no exterior, nem da temporização orbital. Os simuladores de sinal resolvem este problema ao reproduzir sinais GNSS em condições controladas e repetíveis. Neste projeto, o hardware SDR constitui a camada de transmissão: amostras I/Q pré-calculadas são transmitidas em fluxo contínuo e convertidas em saída de RF.

Transição: isto cria uma necessidade clara, mas também uma lacuna prática de engenharia.

## Slide 3 - Problema: Distância entre a intenção de alto nível e o controlo de baixo nível
O primeiro problema é que a DTAPI, apesar de poderosa, é de baixo nível e exige sequenciamento rigoroso de chamadas, gestão manual de estado, e atenção direta a detalhes de FIFO e DMA. O segundo problema é ao nível do ecossistema: não existe uma ponte open-source clara entre geradores de I/Q GNSS e hardware SDR profissional neste contexto. O terceiro problema é a integração RS-232: a interface série resolve apenas o transporte físico, por isso é necessário definir uma forma robusta de expor o controlo de alto nível através dessa ligação.

## Slide 4 - Trabalho proposto: Três fases
O plano do estágio previa três fases. A Fase 1 consistia numa abstração de controlo SDR em C++ sobre a DTAPI. A Fase 2 correspondia à gestão de parâmetros, para que os utilizadores pudessem configurar transmissões sem recorrer diretamente à API de baixo nível. A Fase 3 era uma camada de conectividade RS-232 para integração com equipamento externo.

Transição: na prática, o âmbito evoluiu, como é frequente acontecer em projetos reais.

## Slide 5 - Evolução do âmbito
Ocorreram três alterações. Primeiro, a proposta original referia RS-485, mas a interface efetivamente necessária era RS-232 desde o início; tratou-se de um equívoco de nomenclatura, identificado precocemente, com impacto mínimo no desenho. Segundo, uma abordagem inicial com protocolo aplicacional próprio sobre a ligação série foi abandonada em favor de PPP sobre RS-232, criando um canal IP sobre o qual o gRPC já existente podia ser reutilizado. Terceiro, como os objetivos iniciais foram atingidos cedo, parte destas decisões finais já pertenceu à continuação do trabalho diretamente na GMV, fora do enquadramento contratual da universidade.

## Slide 6 - Arquitetura do sistema de controlo SDR

O sistema de controlo SDR segue uma arquitetura cliente-servidor sobre gRPC. Um cliente CLI comunica com um servidor; o servidor delega numa camada de aplicação e numa fachada (facade) sobre a DTAPI; essa fachada encapsula o comportamento de baixo nível do SDK para as placas DTA-2115B e DTA-2116. O contrato .proto é partilhado, e os stubs são gerados a partir de uma única fonte.

Optei pelo gRPC por três razões: fiabilidade e desempenho, tipagem forte na fronteira do contrato, e suporte de reflection, que ajudou no debugging, na gestão de configuração e na descoberta de comandos.

## Slide 7 - Decisões de desenho transversais
Ao longo de ambos os sistemas, mantiveram-se três princípios consistentes. Primeiro, erros como valores, usando `std::expected<T,E>` em vez de exceções ou códigos de erro ao estilo C, tornando o fluxo de erro explícito e verificado ao nível de tipos. Segundo, o CMake como sistema de build, por facilitar integração com toolchains externas, testes e packaging. Terceiro, a preferência por reutilizar stacks padronizadas em vez de criar protocolos próprios quando a necessidade real era apenas de transporte.

## Slide 8 - Demonstração do controlo SDR

Nesta parte, demonstro o controlo em tempo real do sistema SDR através de uma pequena demonstração que simula a mudança de amplitude de transmissão. O cliente CLI envia comandos de configuração ao servidor, que os aplica à placa SDR. O que vamos observar é o gráfico obtido por um sensor de potência ligado à saída de RF, mostrando a variação da amplitude de transmissão em resposta aos comandos do cliente.

## Slide 9 - Arquitetura da interface RS-232
A arquitetura final daCOBS interface RS-232 é em camadas. Na base está a porta série, configurada com os parâmetros elétricos e de `termios` adequados. Por cima, estabelece-se uma ligação PPP, que encapsula pacotes IP sobre o fluxo de bytes da porta série. Finalmente, acima da camada IP, corre exatamente o mesmo canal gRPC usado nas restantes integrações.

Isto evita manter um segundo protocolo aplicacional, reduz código específico de integração, e faz com que a ligação série se comporte, do ponto de vista da aplicação, como uma ligação de rede ponto-a-ponto.

## Slide 10 - Integração e testes

Nesta fase, quero destacar apenas dois elementos da validação: os testes unitários e o componente externo de teste. Os testes unitários ajudaram a verificar comportamento localmente, isolar regressões e dar confiança durante a evolução da implementação.

Em complemento, o componente externo de teste simula o recetor remoto sobre PPP em cima de RS-232, exercitando de ponta a ponta a ligação série, o transporte IP e o caminho de controlo por gRPC. Em conjunto, estes dois níveis deram cobertura tanto ao comportamento interno dos componentes como ao funcionamento integrado do sistema.

## Slide 11 - Desafios enfrentados

Destacam-se dois desafios técnicos. O primeiro foi ao nível da DTAPI: em alguns pontos, a documentação não descrevia totalmente o comportamento real das funções, incluindo side effects não expectáveis, o que obrigou a validar comportamento por teste direto em hardware. O segundo foi ao nível de hardware/driver e cablagem: o driver genérico 8250 revelou-se insuficiente para a placa WCH CH382, pelo que foi necessário usar o driver do fabricante, e a ausência inicial de um adaptador null-modem causou um desencontro DTE-para-DTE entre TX e TX.

Estes problemas reforçaram o valor de testes sistemáticos com hardware real integrado no processo.

## Slide 13 - Conclusão
Para concluir, o trabalho resultou em dois sistemas complementares: uma abstração habilitada para gRPC sobre a DTAPI para controlo SDR, e uma camada de conectividade RS-232 que, através de PPP, expõe um canal IP para o mesmo plano de controlo. Em conjunto, estes sistemas colmatam a lacuna entre APIs de hardware de baixo nível e as necessidades de automação programática em fluxos de trabalho de transmissão de sinais GNSS.

A retrospetiva geral é equilibrada: a extensibilidade ajudou a absorver mudanças externas, sobretudo as exigências de integração não planeadas, mas a procura de generalidade demasiado cedo teve um custo real.

## Slide 13 - Perguntas

Obrigado pela vossa atenção. Terei todo o gosto em discutir opções de arquitetura, compromissos de integração, metodologia de testes, ou possíveis extensões futuras.

---

## Abertura opcional de 30 segundos
Bom dia / Boa tarde. Vou apresentar o trabalho desenvolvido na GMV, iniciado durante o meu estágio e continuado depois na empresa: um sistema de controlo SDR em C++ sobre a DTAPI, exposto via gRPC, e uma integração RS-232 baseada em PPP para transportar esse mesmo canal de controlo. Vou abordar a motivação, a arquitetura, as opções de implementação, as conclusões da integração, os testes em hardware real, e as principais lições de engenharia retiradas.

## Fecho opcional de 30 segundos
Em resumo, este trabalho produziu uma base reutilizável para o controlo de transmissão de sinais GNSS baseado em SDR e para a integração série em condições reais de engenharia, reutilizando gRPC sobre uma ligação PPP em RS-232 em vez de manter um protocolo próprio. Os sistemas estão funcionais, validados em hardware, e desenhados para serem estendidos onde os requisitos concretos o justifiquem. Obrigado.
