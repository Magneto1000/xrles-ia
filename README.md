# 🎧 Xrles.ia — Conversor Neural de PDF para MP3

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-N--Tier_&_Stateless-16a34a?style=for-the-badge)

**Xrles.ia** é uma plataforma web projetada com **Arquitetura em Camadas (N-Tier)** e estética **Neo-Brutalista Editorial de Alto Contraste** para converter livros, artigos científicos e apostilas em formato `.PDF` diretamente em audiobooks `.MP3` utilizando síntese de voz neural em Português do Brasil (`pt-BR`).

---

## ✨ Diferenciais de Engenharia

- **Arquitetura N-Tier Modular:** Separação estrita entre Camada de Apresentação (`UI/Features`), Camada de Aplicação (`API Controllers`), Camada de Domínio (`Entities & Business Services`) e Camada de Infraestrutura (`TTS Adapters & Cloud Connectors`).
- **Processamento em Blocos (Smart Chunking):** Evita *timeouts* em ambientes *Serverless* fatiando documentos longos respeitando limites semânticos de pontuação e concatenando *buffers* binários `Uint8Array` em um único arquivo `.mp3` contínuo no cliente.
- **Higienização Editorial de PDF (NLP/Regex):** Limpeza automática de hifens de quebra de linha, cabeçalhos repetitivos e numeração de páginas soltas antes da síntese de voz, garantindo leitura fluida.
- **Voz Neural Acelerada (+30% Prosody Rate):** Geração nativa de áudio com ajuste de cadência (`1.3x`) via `msedge-tts` (`pt-BR-FranciscaNeural`) e *fallback* automático de alta disponibilidade, além de controle de velocidade em tempo real no player integrado.
- **Zero-Persistence & Privacy-First (Stateless):** Nenhum documento ou áudio dos usuários fica retido em banco de dados externo por padrão — todo o fluxo ocorre em memória transitória, garantindo privacidade total e custo zero de armazenamento.
- **Design System Neo-Brutalista Editorial:** Componentes atômicos proprietários com bordas sólidas (`border-2 border-black`), sombras geométricas rígidas (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`), tipografia combinada (*Plus Jakarta Sans* + *Merriweather*) e feedback tátil.

---

## 🏗️ Estrutura da Arquitetura (N-Tier)

```text
src/
├── app/                        # [Presentation & Application Tier]
│   ├── api/
│   │   ├── extract-pdf/        # Endpoint de extração binária e limpeza do PDF
│   │   └── synthesize/         # Endpoint atômico de síntese de voz (MP3 Buffer)
│   ├── globals.css             # Tokens de tema e configuração Tailwind v4
│   ├── layout.tsx              # Injeção tipográfica (Jakarta Sans + Merriweather)
│   └── page.tsx                # Orquestrador principal da interface
├── components/                 # [Presentation Tier]
│   ├── ui/
│   │   └── neo-brutal-ui.tsx   # Design System Atômico (Cards, Botões, Inputs, Alertas)
│   └── features/               # Módulos de domínio visual desacoplados
│       ├── header-brand.tsx
│       ├── pdf-reader-preview.tsx
│       └── audio-library-sidebar.tsx
├── core/                       # [Domain Tier - Regras de Negócio Puras]
│   ├── entities/
│   │   └── document.entity.ts  # Contratos de Domínio (ExtractedDocument, AudioTrack)
│   └── services/
│       ├── pdf-text-processor.service.ts # Sanitização de texto e divisão em chunks
│       └── audio-assembler.service.ts    # Orquestração sequencial e montagem do Blob MP3
└── infrastructure/             # [Infrastructure & Data Tier]
    ├── tts/
    │   └── free-tts.adapter.ts # Adaptador de Voz Neural (Edge-TTS + Fallback)
    └── firebase/
        └── firebase-client.ts  # Conector Singleton Lazy para expansões futuras
```

---

## 🚀 Tecnologias Utilizadas

| Camada | Tecnologia | Função no Projeto |
| :--- | :--- | :--- |
| **Front-end & Framework** | Next.js 16 (App Router + Turbopack) | Renderização híbrida, rotas de API Serverless e build otimizado. |
| **Estilização** | Tailwind CSS v4 + Lucide React | Construção do Design System Neo-Brutalista Editorial. |
| **Extração Documental** | `unpdf` | Leitura de PDFs em `Uint8Array` compatível com ambientes Serverless. |
| **Motor de IA de Voz** | `msedge-tts` | Síntese neural em Português (`pt-BR`) com controle de *prosody rate*. |
| **Infraestrutura Futura** | Firebase SDK (Lazy Singleton) | Pré-configurado para persistência opcional sob demanda. |

---

## 🛠️ Como Executar Localmente

### 1. Pré-requisitos
- **Node.js** `v20+` ou `v22+`
- **Git**

### 2. Instalação
Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/SEU-USUARIO/xrles-ia.git](https://github.com/SEU-USUARIO/xrles-ia.git)
cd xrles-ia
npm install
```

### 3. Servidor de Desenvolvimento
Inicie o servidor com Turbopack:

```bash
npm run dev
```
Acesse **`http://localhost:3000`** no navegador.

### 4. Build de Produção
Para validar a tipagem estrita do TypeScript e gerar o pacote otimizado:

```bash
npm run build
npm start
```

---

## 🔄 Fluxo de Conversão (Pipeline de Dados)

1. **Upload:** O usuário seleciona um arquivo `.pdf` na interface Neo-Brutalista.
2. **Extração e Sanitização (`/api/extract-pdf`):** O binário é lido via `unpdf` e higienizado pelo `PdfTextProcessorService`, que reconstrói parágrafos quebrados, calcula a estimativa de tempo de leitura e divide o texto em blocos semânticos.
3. **Pré-visualização Editorial:** O texto limpo é exibido em tipografia serifada (*Merriweather*) com indicadores de páginas, quantidade de blocos e duração estimada.
4. **Síntese Neural Sequencial (`/api/synthesize`):** O `AudioAssemblerService` envia bloco por bloco para o `FreeTtsAdapter`, atualizando a barra de progresso em tempo real e unificando os *streams* de áudio `audio/mpeg`.
5. **Reprodução e Download:** O arquivo `.mp3` consolidado fica disponível imediatamente no player nativo com controle fino de velocidade (`1.0x`, `1.15x`, `1.3x`) e botão de download direto.

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Sinta-se livre para estudar a arquitetura, realizar *forks* e evoluir a plataforma.