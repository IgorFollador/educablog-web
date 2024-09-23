# EducaBlog-Web

Este projeto é um aplicativo web construído com **Next.js** e outras tecnologias de front-end, como **React**, **Styled-Components** e **Tailwind CSS**. O projeto também integra funcionalidades de autenticação com **NextAuth.js** e usa **Axios** para realizar requisições HTTP para APIs externas.

## Pré-requisitos

Antes de começar, certifique-se de que sua máquina tenha as seguintes ferramentas instaladas:

- **Node.js** (versão recomendada: 18 ou superior)
- **npm** (gerenciador de pacotes que vem junto com o Node.js) ou **Yarn** como alternativa.

## Instalação

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local:

### 1. Clone o repositório

Abra o terminal e execute o comando para clonar o repositório do projeto:

```bash
git clone https://github.com/IgorFollador/educablog-web.git
```

### 2. Acesse o diretório do projeto

Entre no diretório do projeto clonado:

```bash
cd educablog-web
```

### 3. Instale as dependências

Use o npm ou yarn para instalar todas as dependências necessárias:

```bash
npm install
```

ou

```bash
yarn install
```

### 4. Configuração das variáveis de ambiente

Crie um arquivo .env.local na raiz do projeto e adicione as variáveis de ambiente fornecidas para configuração:

```bash
NEXTAUTH_SECRET="SuperSecretKeyForNextAuth123!ChangeMe"
NEXT_PUBLIC_SITE_URL="https://educablog-web.vercel.app/"
NEXT_PUBLIC_API_URL="https://apl-back-educablog-1.onrender.com"
NEXT_PUBLIC_POSTS_LIMIT=10
NEXT_PUBLIC_DISQUS_NAME="educablog-1"
```
Estas variáveis são essenciais para o funcionamento correto do aplicativo, incluindo a autenticação, a comunicação com a API e a integração com o Disqus para comentários.

### 5. Executando o projeto localmente

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```

ou

```bash
yarn dev
```

Este comando irá iniciar o servidor em modo de desenvolvimento. Você pode acessar a aplicação no seu navegador através do endereço:
```bash
http://localhost:3000
```

#### OBS:
- Aqui estão os principais scripts disponíveis no package.json:

```bash
npm run dev: Inicia o servidor de desenvolvimento.
npm run build: Compila o projeto para produção.
npm start: Inicia o servidor com a build otimizada para produção.
npm run lint: Executa o ESLint para verificação de boas práticas de código.
```

- Para instalar a API do projeto localmente [acesse aqui](https://github.com/IgorFollador/educablog-api/)
