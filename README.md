# AETHER MOTORS

Site conceitual de uma marca **fictícia** de veículos elétricos premium.
Todos os veículos, especificações, preços, cores e textos são **demonstração**.
Não há relação com fabricantes existentes e não há oferta de venda.

## Stack

- React 18 + Vite 5 + TypeScript (modo estrito)
- Tailwind CSS 3
- React Router 6 (rotas com carregamento sob demanda)
- GSAP + ScrollTrigger (intro do hero e narrativa fixada ao scroll)

**Three.js não foi incluído.** Não há modelo 3D licenciado e confiável disponível para este projeto.
Em vez de fingir um modelo 3D, o site usa ilustrações vetoriais originais (`src/components/VehicleSvg.tsx`),
que mudam de cor conforme a escolha no configurador. Se um asset 3D licenciado for adquirido, a integração
com Three.js pode ser feita no componente de visualização sem alterar as demais telas.

## Visual dos veículos

Os carros são **ilustrações vetoriais originais** geradas por código (`src/lib/vehicleArt.ts`), com silhuetas
distintas para sedã, SUV e cupê: faróis e lanternas em LED com brilho, rodas aerodinâmicas, vidros com reflexo,
luz de borda (para cores escuras), reflexo no chão e brilho azul sob o carro. Não são renders fotográficos nem
modelo 3D. Se quiser fotografia ou 3D real, é preciso um asset com licença adequada.

No configurador, a imagem reflete as escolhas: **cor**, **acabamento** (Espelhado = brilho forte, Cetim = médio,
Fosco = quase sem brilho), **Rodas de 21"** (aro maior, pneu mais fino) e **Teto panorâmico** (vidro azulado).
Ao mover o mouse sobre o carro, ele se inclina levemente (desligado com `prefers-reduced-motion` e em toque).

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Hero em tela cheia com números animados, narrativa fixada ao scroll, linha de modelos, faixa de números e chamada final |
| `/veiculos` | Catálogo com três modelos conceituais |
| `/veiculos/:id` | Detalhes, seletor de cor com pré-visualização, números de destaque e especificações fictícias |
| `/configurador` | Modelo, cor, acabamento e opcionais; preço ilustrativo em tempo real; resumo; download `.txt`; solicitação de proposta |
| `/tecnologia` | Bateria, materiais, experiência de condução |
| `/sobre` | Sobre a marca fictícia |
| `/contato` | Formulário com validação e envio para um serviço configurável |

## Executar localmente

Requisitos: Node.js 18.18 ou superior.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # checagem de tipos + build de produção em dist/
npm run preview    # serve o build localmente
```

## Configurar o formulário de contato

O formulário envia um `POST` JSON para o endpoint definido em `VITE_CONTACT_ENDPOINT`.

1. Copie `.env.example` para `.env.local`.
2. Defina a URL de um serviço real (Formspree, Make, Zapier, webhook próprio ou API sua).
3. Reinicie o `npm run dev` (variáveis `VITE_` são lidas no build).

Sem essa variável, o formulário **não simula envio**: exibe que o serviço não está configurado.
O campo `website` é um honeypot oculto contra bots. O payload inclui `name`, `email`, `phone`,
`interest`, `message`, `consent`, `configuration` (texto do resumo, quando houver), `source` e `sentAt`.

## Configurador

- Modelo, cor e acabamento são obrigatórios. Opcionais são livres.
- Enquanto faltar algo, "Baixar resumo" e "Solicitar proposta" mostram quais campos faltam.
- O resumo (`.txt`) contém modelo, cor, acabamento, opcionais, valores ilustrativos, total e especificações fictícias.
- **PDF não foi implementado.** Foi escolhido o `.txt` porque a geração de PDF confiável exige dependência extra
  e validação visual que não foi feita neste projeto.

## Acessibilidade e desempenho

- Navegação por teclado, link "pular para o conteúdo", `aria-live` nos totais e erros ligados aos campos.
- `prefers-reduced-motion`: as animações GSAP não são criadas e a narrativa vira uma lista estática; o CSS também reduz transições.
- Rotas carregadas sob demanda (`React.lazy`), chunks separados para GSAP e roteador.
- Ilustrações em SVG (leves, sem imagens rasterizadas para otimizar).
- Layout responsivo com menu mobile.

**Imagens:** não há fotografias ou renders no projeto. Para incluir fotos reais, use formatos modernos
(AVIF/WebP), `loading="lazy"` e dimensões explícitas, e somente com direitos de uso.

## Deploy na Vercel

1. Envie o projeto para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta Vite. Confirme: Build Command `npm run build`, Output Directory `dist`.
4. Em **Settings → Environment Variables**, adicione `VITE_CONTACT_ENDPOINT` (se usar o formulário).
5. Faça o deploy. O `vercel.json` já inclui o rewrite para que as rotas do SPA funcionem ao recarregar.

Alternativa via CLI: `npm i -g vercel && vercel` (primeiro deploy) e `vercel --prod` (produção).

## Estrutura

```
src/
  App.tsx              rotas
  main.tsx             entrada (BrowserRouter)
  components/          Layout, VehicleSvg
  pages/               uma página por rota
  data/vehicles.ts     TODOS os dados fictícios (modelos, paleta, acabamentos, opcionais)
  lib/configurator.ts  preços, validação e texto do resumo
  lib/contact.ts       validação e envio do formulário
  hooks/useReducedMotion.ts
```

Para trocar qualquer dado da demonstração, edite somente `src/data/vehicles.ts`.

## Status de verificação

- Código-fonte escrito completo, com todas as rotas e funções descritas acima.
- Sintaxe de todos os arquivos TypeScript/TSX verificada.
- Checagem estrita de tipos (`strict`, `noUnusedLocals`) aprovada nos módulos sem dependências externas
  (`vehicleArt`, `configurator`, `vehicles`).
- Os três modelos foram renderizados em PNG e inspecionados visualmente (ver "Visual dos veículos").
- **Não testado em navegador:** animações GSAP, inclinação por mouse, contadores e a página no celular.
- **O build (`npm run build`) não foi executado neste ambiente**, porque não havia acesso à rede para instalar as dependências.
  Execute `npm install && npm run build` antes de publicar e corrija qualquer erro que aparecer.
