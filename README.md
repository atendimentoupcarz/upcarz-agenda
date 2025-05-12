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
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

## Construção para produção

```bash
npm run build
```

Isso irá gerar os arquivos otimizados na pasta `dist/`.

## Implantação no GitHub Pages

1. Certifique-se de que todas as alterações foram commitadas
2. Execute o script de build:
   ```bash
   npm run build
   ```
3. Faça push da branch `gh-pages` para o GitHub

### Implantação automática com GitHub Actions

O projeto inclui um fluxo de trabalho do GitHub Actions que implanta automaticamente na branch `gh-pages` quando você faz push para a branch `main`.

## Estrutura do Projeto

- `src/` - Código-fonte do aplicativo
  - `components/` - Componentes reutilizáveis
  - `styles/` - Estilos globais
  - `utils/` - Funções utilitárias
  - `App.js` - Componente raiz do aplicativo
  - `index.js` - Ponto de entrada do aplicativo
- `public/` - Arquivos estáticos
- `dist/` - Arquivos de construção (gerados)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (se necessário):

```
VITE_APP_TITLE=Upcarz Scheduler
VITE_API_URL=https://sua-api.com
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
