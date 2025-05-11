# Upcarz Scheduler

Sistema de agendamento de lavagem de carros para condomínios em Jundiaí.

## Funcionalidades

- Visualização de horários disponíveis por condomínio
- Navegação por semanas
- Seleção de horários
- Confirmação de agendamento
- Interface responsiva

## Desenvolvimento

### Pré-requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior) ou Yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/upcarz-scheduler.git
   cd upcarz-scheduler
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```

### Executando localmente

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

### Construção para produção

```bash
npm run build
# ou
yarn build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## Estrutura do Projeto

```
upcarz-scheduler/
├── src/
│   ├── agenda.js      # Gerenciador de agenda
│   ├── config.js      # Configurações do aplicativo
│   ├── main.js        # Ponto de entrada do aplicativo
│   └── utils.js       # Funções utilitárias
├── data/              # Dados locais (JSON)
├── dist/             # Build de produção
├── public/            # Arquivos estáticos
├── index.html         # Página principal
├── package.json       # Dependências e scripts
├── tailwind.config.js # Configuração do Tailwind CSS
└── vite.config.js     # Configuração do Vite
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (se necessário):

```
VITE_APP_TITLE=Upcarz Scheduler
VITE_API_URL=https://sua-api.com
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
