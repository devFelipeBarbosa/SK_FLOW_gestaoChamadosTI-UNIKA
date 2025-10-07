# 🚀 SK\_FLOW\_gestaoChamadosTI-UNIKA

## Visão Geral do Projeto

Este repositório contém a documentação, os scripts SQL/PL/SQL e as configurações iniciais do **Sankhya Flow** para a gestão de **Chamados de TI (Service Desk)** do Cliente UNIKA, substituindo a plataforma externa GLPI.

O objetivo principal é unificar o fluxo de trabalho de TI com o ERP Sankhya, garantindo **rastreabilidade**, **governança de dados** e **integração nativa** com os módulos de **Patrimônio** e **Compras/Cotação**.

---

## 🎯 Objetivo e Ganhos

| Objetivo | Descrição |
| :--- | :--- |
| **Integração Nativa** | Unificar o Service Desk com o ERP, eliminando a dependência do GLPI. |
| **Governança Patrimonial** | Vínculo obrigatório do chamado ao **Ativo/Patrimônio** (Máquina, Celular, etc.) cadastrado no Sankhya. |
| **Automação de Compras** | Iniciar um processo de **Cotação/Compra** no ERP a partir de uma necessidade no chamado. |
| **Base de Conhecimento** | Criar um repositório interno de soluções para otimizar o tempo de resposta do técnico. |

---

## ⚙️ Fluxo de Processo (BPMN Simplificado)

O Flow seguirá a estrutura do processo de atendimento já validada com o usuário-chave (Álvaro Pimenta), com a adição das etapas de integração com o ERP.

1.  **Abertura do Chamado:** Usuário Final.
2.  **Triagem / Novo:** Fila de espera automática, aguardando atribuição.
3.  **Atribuição / Em Atendimento:** Analista de TI (Pool de Usuários).
    * *Gateway Condicional:* Se **Necessita de Compra**, direciona para o **Módulo de Cotação** do Sankhya.
4.  **Aguardando Terceiro/Compra:** O chamado fica em espera no Flow (Evento de Espera por NF).
5.  **Solucionado:** Registro da solução pelo Analista de TI.
6.  **Aguardando Aprovação:** Usuário Final valida a solução.
7.  **Fechamento:** (Automático) Se Aprovado.
8.  **Reabertura (Retorno):** Se Reprovado, retorna para a etapa "Em Atendimento".

---

## 🛠️ Requisitos de Classificação e Configuração

As seguintes listas, extraídas do GLPI, são a base para os campos de seleção (Lookups) e filtros condicionais no Sankhya Flow:

| Estrutura | Finalidade | Arquivo Fonte (GLPI) |
| :--- | :--- | :--- |
| **Categorias** (Hierárquicas) | Classificação do problema (Ex: E-mail > Resetar Senha). Inclui itens de **Facilities** e **Protheus** que exigem desvios no Flow. | `Categorias da ITIL.csv` |
| **Localizações** | Determinar o Departamento/Unidade do solicitante. Usado para filtros de atendimento. | `Localizações.csv` |
| **Origem do Ticket** | Como o chamado foi aberto (Ex: Helpdesk, E-Mail, Phone). | `Origem Tickets.csv` |
| **Tipos de Computador** | Descrição básica do equipamento (Desktop ou Notebook). | `Tipos de computador.csv` |

---

## 💻 Detalhes de Back-End e Scripts (PL/SQL / T-SQL)

Estes são os pontos críticos que exigem desenvolvimento de rotinas e/ou customização de tabelas, e devem ser versionados neste repositório (Pasta `scripts/`):

| Requisito | Ação Técnica Necessária |
| :--- | :--- |
| **Tabela Customizada** | Criação da tabela principal **AD\_CHAMADOTI** para armazenar as informações customizadas do chamado (ID do Flow, Código do Patrimônio, etc.). |
| **Vínculo Patrimonial** | Script de **Lookup** para filtrar os ativos/produtos (`TGFPRO` ou `TGPPAT`) que pertencem à UNIKA, garantindo que o usuário só possa vincular um equipamento válido no Front-End. |
| **Integração Compras** | Script para **inserção automática** de um registro no **Módulo de Cotação** ao acionar o *Gateway* de "Necessita de Compra". |
| **Base de Conhecimento** | Rotina para salvar o texto da solução em uma tabela separada (Ex: **AD\_BASE\_CONHECIMENTO**) se o Analista de TI selecionar esta opção. |

---

**Status Atual:** Documentação inicial de Regras de Negócio e Levantamento de Classificações concluída.

**Próxima Etapa:** Modelagem da Tabela Customizada (`AD_CHAMADOTI`) e criação do script de **Lookup de Patrimônio**.
