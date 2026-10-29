## Backend: execução e API

O backend usa NestJS, PostgreSQL e Drizzle ORM. Para subir a infraestrutura local:

```bash
docker compose up -d postgres
cd backend
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run start:dev
```

### Arquitetura do backend

Cada módulo de negócio em `backend/src/modules` segue a separação:

```text
modules/<modulo>/
├── domain/
│   ├── entities/       # modelos e invariantes do domínio
│   └── repositories/   # contratos, sem dependência de Drizzle/Nest
├── application/
│   ├── dtos/           # entradas e saídas do caso de uso
│   └── use-cases/      # orquestração das regras de negócio
└── infrastructure/
    ├── controllers/    # adaptadores HTTP/Nest
    └── repositories/   # implementações de persistência
```

O banco compartilhado fica em `backend/src/database`. Controllers
dependem de casos de uso; casos de uso dependem de contratos do domínio; e
implementações concretas de infraestrutura são compostas pelos módulos Nest.
Assim, a regra de negócio não precisa conhecer HTTP ou o ORM e pode ser
testada isoladamente.

O seed cria duas obras, três usuários, dois fornecedores e regras de alçada de
demonstração. A API fica disponível em `http://localhost:3001`. Os valores
monetários da API são enviados em centavos (por exemplo, `1000000` representa
R$ 10.000,00).

Principais endpoints:

| Método | Endpoint | Uso |
|---|---|---|
| `GET/POST` | `/works`, `/users`, `/suppliers` | Consultar e cadastrar dados de referência |
| `GET/POST/PATCH/DELETE` | `/works/:workId/approval-rules[/:ruleId]` | Gerenciar faixas e aprovadores ordenados |
| `GET` | `/orders` e `/orders/:id` | Listar pedidos e consultar itens/histórico |
| `POST` | `/orders` | Criar pedido e materializar sua cadeia de aprovação |
| `POST` | `/orders/:id/approve` | Aprovar a etapa atual (`{"userId": 1}`) |
| `POST` | `/orders/:id/reject` | Rejeitar com motivo (`{"userId": 1, "reason": "..."}`) |

Exemplo de criação de pedido:

```json
{
  "workId": 1,
  "supplierId": 1,
  "orderDate": "2026-10-28T12:00:00.000Z",
  "notes": "Compra para a fundação",
  "items": [
    { "description": "Cimento", "quantity": "20", "unit": "saco", "unitPriceCents": 4500 }
  ]
}
```

O total é calculado exclusivamente no backend. A regra aplicável é a faixa
com maior limite mínimo que contenha o total; se não houver regra, o pedido é
recusado. A criação do cabeçalho, itens e etapas ocorre em uma transação.
Somente o aprovador da etapa pendente pode decidir. Uma rejeição exige motivo,
interrompe a cadeia e permanece no histórico; após a última aprovação o pedido
passa para `APPROVED`. Faixas sem limite máximo representam o intervalo final.

### Decisões técnicas

- **PostgreSQL + Drizzle:** integridade referencial, enums de status, índices
  únicos e transações explícitas, mantendo as consultas próximas ao SQL.
- **Centavos inteiros:** evita erros de ponto flutuante em totais e limites.
- **Cadeia materializada:** alterações futuras nas regras não mudam o histórico
  de um pedido já criado.
- **Validação e concorrência:** DTOs rejeitam payloads inválidos; a transação
  verifica a etapa pendente e o status atual antes de registrar cada decisão.
- Em produção, adicionaria autenticação/autorização, paginação, auditoria
  imutável, observabilidade, migrações executadas no deploy e pool gerenciado.

---

# O que você vai construir

Três telas. O layout é livre — **não entregamos Figma, API ou implementação de referência**. O desenho das telas e as decisões de produto são parte da avaliação.

## 1. Cadastro de pedido de compra

Um pedido de compra representa uma solicitação ao fornecedor e deve conter **um ou mais itens**. A alçada é determinada pelo **valor total do pedido**, e não pelo valor isolado de um item.


### Dados gerais

| Campo | Obrigatório | Comportamento esperado |
|---|---:|---|
| Obra | Sim | Lista as obras disponíveis para o pedido. |
| Fornecedor | Sim | Identifica o fornecedor do pedido. |
| Data do pedido | Sim | Data de emissão do pedido. |
| Observações internas | Não | Campo livre para justificar ou complementar a solicitação. |

Não é **obrigatório** criar uma tela de cadastro de fornecedor, obra ou usuário — se quiser, considere que esses dados já existem no sistema. A tela deve apenas permitir selecionar a obra e o fornecedor do pedido.

### Itens do pedido

A tela começa com um item em branco e deve permitir **adicionar, editar e remover N itens** antes do envio. Cada item deve ter, no mínimo:

| Campo | Obrigatório | Comportamento esperado |
|---|---:|---|
| Descrição | Sim | Descreve claramente o material ou serviço. |
| Quantidade | Sim | Número positivo; pode aceitar decimais. |
| Unidade | Sim | Por exemplo: `un`, `kg`, `m`, `m²` ou `h`. |
| Preço unitário | Sim | Valor monetário não negativo. |
| Total do item | Calculado | `quantidade × preço unitário`; não deve ser editável diretamente. |

O candidato pode definir a experiência de uso mais adequada — por exemplo, uma tabela expansível, um formulário por item ou um drawer — desde que a inclusão de vários itens permaneça clara.

### Totalização e envio

A interface deve exibir o **total do pedido**, calculado pela soma dos totais dos itens. Esse é o valor usado para selecionar a regra de alçada.

O botão **Cadastrar pedido** só deve ficar disponível quando os dados gerais e todos os itens forem válidos. Ao criar o pedido, o back-end deve persistir cabeçalho, itens, total calculado e cadeia inicial de aprovação.
## 2. Aprovação

A tela deve listar pedidos e permitir abrir os detalhes de cada um. A lista pode ser em tabela, cartões ou outra composição clara, mas deve apresentar pelo menos:

| Informação por pedido | Descrição |
|---|---|
| Identificador, obra e fornecedor | Contexto rápido do pedido. |
| Data, quantidade de itens e valor total | Resumo financeiro e operacional. |
| Situação | Pendente, aprovado ou rejeitado. |
| Alçada atual | Aprovadores concluídos, aprovador atual e próximas etapas. |
| Ações | Aprovar ou rejeitar quando houver uma decisão disponível. |

Nos detalhes, apresente os itens — descrição, quantidade, unidade, preço unitário e total — além do histórico de decisões. A lista de pedidos **pendentes** deve refletir o nível atual da alçada, calculado e persistido pelo back-end. A rejeição exige motivo, interrompe o fluxo e fica registrada no histórico. Quando toda a cadeia for concluída, as ações de decisão devem estar desabilitadas com uma explicação.

## 3. Regras da alçada

A tela deve permitir selecionar uma obra e configurar as faixas de valor que definem a cadeia de aprovação. Uma representação mínima pode ser uma tabela como esta:

| Faixa de valor | Aprovadores, na ordem do fluxo | Ações |
|---|---|---|
| Até R$ 10.000,00 | Amanda | Editar / remover |
| Acima de R$ 10.000,00 | Amanda → João | Editar / remover |

A interface deve listar usuários disponíveis e permitir:

* criar, editar e remover níveis/faixas de alçada;
* definir o limite de valor de cada faixa;
* adicionar, remover e reordenar aprovadores em cada faixa;
* listar as regras já salvas para a obra selecionada.

O comportamento para valores sem regra aplicável deve ser definido e documentado pelo candidato — por exemplo, impedir o envio do pedido com uma mensagem clara.

---

# Validações e erros (exigidos)

| Situação | Comportamento esperado |
|---|---|
| Quantidade ou preço unitário inválido, negativo ou não numérico | erro no item correspondente, mensagem compreensível, não envia |
| Pedido sem itens | erro claro; não envia |
| Campos obrigatórios vazios (obra, fornecedor, data ou descrição de item) | erro no campo correspondente; não envia |
| Nenhuma obra cadastrada | empty state amigável, não tela branca |
| API fora do ar / 500 | estado de erro com opção de tentar novamente |
| Rejeitar sem motivo | validação antes do submit |
| Cadeia de alçada já concluída | botão de decisão desabilitado + explicação |

Loading state é obrigatório em toda lista.

---

# 📦 Como entregar (Prazo: 01/11/2026 às 23:59)
O repositório deve conter instruções claras para instalar dependências, configurar o ambiente e iniciar a solução completa (front-end, back-end e banco de dados, quando aplicável). O método de execução é livre; `docker compose` é aceito, mas não obrigatório.

Repositório deve conter:

* código-fonte do front-e˝nd e do back-end;
* dados de demonstração e instruções para criá-los ou carregá-los;
* `README.md` com explicando:
  * screenshots das telas;
  * as tecnologias escolhidas e os motivos da escolha;
  * como a regra de alçada é modelada, calculada e persistida;
  * como o front-end se comunica com o back-end;
  * como a consistência e a integridade dos dados são garantidas;
  * o que mudaria em produção;
1. Faça um **Fork** deste repositório (`https://github.com/ObraFlow/obraflow-case`).
2. Abra um **Pull Request (PR)** para este repositório até **01/11/2026 às 23:59**.
3. **Importante:** Na descrição do seu Pull Request, deixe seu **e-mail e telefone (WhatsApp)** para contato!

---

# Avaliação

| Critério | Peso |
|---|---:|
| Funcionamento completo: front-end, back-end e persistência | 25% |
| Modelagem e implementação das regras de alçada | 20% |
| Qualidade de código, organização e decisões técnicas | 15% |
| **Desenho de UI: hierarquia, clareza, consistência** | 20% |
| Estados (loading / empty / erro), responsividade e validações | 10% |
| Documentação (`## Decisões técnicas`) | 10% |

IA é permitida — mas você precisará explicar cada decisão na entrevista de 30 min.

---

## Contato


**Jonathan Bispo**  
WhatsApp: [+55 71 99204-4335](https://wa.me/5571992044335)  
E-mail: [contrato@obraflow.io](mailto:contrato@obraflow.io)
