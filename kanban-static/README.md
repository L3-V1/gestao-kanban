# Gestão Kanban — versão estática

Aplicação sem React, construída com HTML, CSS, Tailwind via CDN e JavaScript modular. Os dados são persistidos no `localStorage` do navegador.

## Executar localmente

Abra `index.html` em um navegador moderno ou sirva esta pasta com um servidor estático. Para publicar no GitHub Pages, selecione a pasta `kanban-static` como origem da publicação (ou publique seu conteúdo na branch configurada).

## Estrutura MVC

- `assets/js/models`: regras e entidades do domínio Kanban.
- `assets/js/views`: renderização do HTML e modais.
- `assets/js/controllers`: coordenação entre regras, armazenamento e interface.
- `assets/js/services`: persistência através do `localStorage`.
