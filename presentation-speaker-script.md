# Guião de Apresentação Oral

Duração estimada: 12-15 minutos

## Slide 1 - Título
Bom dia / Boa tarde, e obrigado por estarem presentes. Chamo-me Gabriel Matias Falcão, e esta apresentação incide sobre o meu estágio de desenvolvimento curricular na GMV, entre 11 de março e 17 de julho de 2026. O trabalho centrou-se no controlo programático de hardware SDR para transmissão de sinais GNSS, e na construção de uma interface RS-232 complementar para integração com equipamento externo.

## Slide 2 - Contexto: Porque é que a simulação de sinais GNSS é importante
As constelações GNSS, como o GPS, Galileo, GLONASS e BeiDou, transmitem continuamente sinais de posicionamento. Em fluxos de trabalho de engenharia e validação, não podemos depender de satélites reais, de condições no exterior, nem da temporização orbital. Os simuladores de sinal resolvem este problema ao reproduzir sinais GNSS em condições controladas e repetíveis. Neste projeto, o hardware SDR constitui a camada de transmissão: amostras I/Q pré-calculadas são transmitidas em fluxo contínuo e convertidas em saída de RF.

Transição: isto cria uma necessidade clara, mas também uma lacuna prática de engenharia.

## Slide 3 - Problema: Distância entre a intenção de alto nível e o controlo de baixo nível
O primeiro problema é que a DTAPI, apesar de poderosa, é de baixo nível e exige sequenciamento rigoroso de chamadas, gestão manual de estado, e atenção direta a detalhes de FIFO e DMA. O segundo problema é ao nível do ecossistema: não existe uma ponte open-source clara entre geradores de I/Q GNSS e hardware SDR profissional neste contexto. O terceiro problema é a integração RS-232: não existe um protocolo de aplicação padrão, pelo que o enquadramento e a semântica das mensagens têm de ser construídos de raiz.

## Slide 4 - Trabalho proposto: Três fases
O plano do estágio previa três fases. A Fase 1 consistia numa abstração de controlo SDR em C++ sobre a DTAPI. A Fase 2 correspondia à gestão de parâmetros, para que os utilizadores pudessem configurar transmissões sem recorrer diretamente à API de baixo nível. A Fase 3 era uma camada de comunicação RS-232 para troca de comandos e estados com equipamento externo.

Transição: na prática, o âmbito evoluiu, como é frequente acontecer em projetos reais.

## Slide 5 - Evolução do âmbito
Ocorreram duas alterações. Primeiro, a proposta original referia RS-485, mas a interface efetivamente necessária era RS-232 desde o início; tratou-se de um equívoco de nomenclatura, identificado precocemente, com impacto mínimo no desenho. Segundo, e de forma mais significativa, tornou-se necessária uma integração não planeada com sistemas proprietários da GMV. Esse esforço de integração não estava previsto no calendário inicial e tornou-se uma das partes mais exigentes do estágio.

## Slide 6 - Arquitetura do sistema de controlo SDR
O sistema de controlo SDR segue uma arquitetura cliente-servidor sobre gRPC. Um cliente CLI comunica com um servidor; o servidor delega numa camada de aplicação e numa fachada (facade) sobre a DTAPI; essa fachada encapsula o comportamento de baixo nível do SDK para as placas DTA-2115B e DTA-2116. O contrato .proto é partilhado, e os stubs são gerados a partir de uma única fonte.

Optei pelo gRPC por três razões: fiabilidade e desempenho, tipagem forte na fronteira do contrato, e suporte de reflection, que ajudou no debugging, na gestão de configuração e na descoberta de comandos.

## Slide 7 - Decisões de desenho transversais
Ao longo de ambos os sistemas, mantiveram-se três princípios consistentes. Primeiro, erros como valores, usando `std::expected<T,E>` em vez de exceções ou códigos de erro ao estilo C, tornando o fluxo de erro explícito e verificado ao nível de tipos. Segundo, o XMake como sistema de build, pela simplicidade de configuração e ergonomia prática. Terceiro, reflection e serialização baseadas em Boost.PFR, para evitar código repetitivo de parsing mantendo o desenho leve.

## Slide 8 - Demonstração do controlo SDR
Nesta parte, demonstro o controlo em tempo real do sistema SDR através de uma pequena demonstração que simula a mudança de amplitude de transmissão. O cliente CLI envia comandos de configuração ao servidor, que os aplica à placa SDR. O que vamos observar é o gráfico obtido por um sensor de potência ligado à saída de RF, mostrando a variação da amplitude de transmissão em resposta aos comandos do cliente.

## Slide 9 - Arquitetura da interface RS-232
A interface RS-232 está construída em torno do registo de protocolo: declara-se uma struct de mensagem em C++, regista-se um handler, e o núcleo não precisa de ser alterado. Os componentes de leitura e escrita trocam dados através de serialização e framing COBS. O Boost.PFR fornece serialização automática ao nível da struct para tipos agregados, e o COBS garante a delimitação fiável de pacotes num fluxo de bytes.

Isto mantém a camada série extensível sem introduzir a sobrecarga pesada de um RPC.

## Slide 10 - Três iterações do SDR
O desenho final surgiu após três iterações. A Versão 1 tentou adaptar um programa de terceiros já existente, mas os pressupostos em torno de threading e extensibilidade não se ajustavam. A Versão 2 foi uma reescrita totalmente genérica, mas acabou por sobre-generalizar além das necessidades reais. A Versão 3, a adotada, foi delimitada especificamente às placas DTA-2115B/2116 e ao caso de uso de I/Q GNSS. A lição principal aqui é que restringir o âmbito a requisitos concretos melhorou a velocidade de implementação, a testabilidade e o raciocínio sobre o sistema.

## Slide 11 - Integração e testes
A validação recorreu a testes unitários, acompanhamento de cobertura com gcovr e tendências no SonarQube, e testes de hardware end-to-end num ambiente prototípico, usando um componente externo de teste. Foram executados três casos de teste principais com equipamento real: configuração de potência com um Rohde & Schwarz NRQ6, configuração de frequência com um contador de frequência, e gravação de sinal com um Ettus USRP X310.

Uma constatação importante da integração: no percurso de integração com os sistemas proprietários da GMV, a fronteira cliente-servidor gRPC não chegou a ser exercitada, porque o componente de aplicação foi ligado in-process. A camada gRPC continua a funcionar e permanece testável através do percurso CLI, mas não foi exigida por essa via de implantação específica.

## Slide 12 - Desafios enfrentados
Destacam-se dois desafios técnicos. Um foi um bug subtil no COBS: um erro de dimensionamento do output por um valor (off-by-one), juntamente com um `pop_back()` incorreto na descodificação, apenas visível para determinados comprimentos de payload. O segundo foi ao nível de hardware/driver e cablagem: o driver genérico 8250 revelou-se insuficiente para a placa WCH CH382, pelo que foi necessário usar o driver do fabricante, e a ausência inicial de um adaptador null-modem causou um desencontro DTE-para-DTE entre TX e TX.

Ambos os problemas reforçaram o valor de testes sistemáticos com hardware real integrado no processo.

## Slide 13 - Conclusão
Para concluir, o estágio resultou em dois sistemas complementares: uma abstração habilitada para gRPC sobre a DTAPI para controlo SDR, e uma camada de protocolo RS-232 leve e extensível. Em conjunto, estes sistemas colmatam a lacuna entre APIs de hardware de baixo nível e as necessidades de automação programática em fluxos de trabalho de transmissão de sinais GNSS.

A retrospetiva geral é equilibrada: a extensibilidade ajudou a absorver mudanças externas, sobretudo as exigências de integração não planeadas, mas a procura de generalidade demasiado cedo teve um custo real.

## Slide 14 - Perguntas
Obrigado pela vossa atenção. Terei todo o gosto em discutir opções de arquitetura, compromissos de integração, metodologia de testes, ou possíveis extensões futuras.

---

## Abertura opcional de 30 segundos
Bom dia / Boa tarde. Vou apresentar o trabalho desenvolvido durante o meu estágio na GMV: um sistema de controlo SDR em C++ sobre a DTAPI, exposto via gRPC, e uma interface RS-232 para troca de comandos e estados com equipamento externo. Vou abordar a motivação, a arquitetura, as opções de implementação, as conclusões da integração, os testes em hardware real, e as principais lições de engenharia retiradas.

## Fecho opcional de 30 segundos
Em resumo, este estágio produziu uma base reutilizável para o controlo de transmissão de sinais GNSS baseado em SDR e para a integração série em condições reais de engenharia. Os sistemas estão funcionais, validados em hardware, e desenhados para serem estendidos onde os requisitos concretos o justifiquem. Obrigado.
