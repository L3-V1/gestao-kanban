import { AREAS, PRIORITIES } from "../models/kanban-model.js";

const icons = {
  folder: "folder-kanban",
  layers: "layers-3",
  plus: "plus",
  edit: "pencil-line",
  trash: "trash-2",
  up: "chevron-up",
  down: "chevron-down",
  user: "user-circle-2",
  calendar: "calendar-clock",
  tag: "tag",
  grip: "grip-vertical",
  save: "save",
  close: "x",
};
const icon = (name, size = 16) =>
  `<i data-lucide="${icons[name]}" width="${size}" height="${size}" aria-hidden="true"></i>`;
const html = String.raw;
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
const priorityClass = {
  Baixa: "bg-emerald-500/20 text-emerald-100",
  Média: "bg-sky-500/20 text-sky-100",
  Alta: "bg-amber-500/20 text-amber-100",
  Crítica: "bg-rose-500/20 text-rose-100",
};

export class KanbanView {
  constructor(appElement, modalElement, toastElement) {
    this.app = appElement;
    this.modal = modalElement;
    this.toasts = toastElement;
  }
  render(state, boardData) {
    this.app.innerHTML = html`${this.header()}
      <section
        class="mx-auto mt-6 flex max-w-screen-2xl flex-col gap-4 xl:gap-6"
      >
        ${this.sidebar(state)}${boardData.board ? this.workspace(boardData) : this.emptyWorkspace()}
      </section>`;
    this.refreshIcons();
  }
  header() {
    return html`<section
      class="panel mx-auto max-w-screen-2xl rounded-3xl p-5 backdrop-blur sm:p-7"
    >
      <div
        class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div class="max-w-3xl">
          <p
            class="text-xs font-semibold uppercase tracking-[.26em] text-[var(--soft)]"
          >
            Gestão de Projetos de T.I.
          </p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Gestão Kanban
          </h1>
          <p class="mt-4 max-w-2xl text-sm text-[var(--muted)] sm:text-base">
            Gerencie quadros, colunas e cartões com persistência local no
            navegador e drag and drop fluido.
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button class="btn" data-action="open-board-create">
            ${icon("folder")}Novo quadro</button
          ><button class="btn btn-secondary" data-action="open-column-create">
            ${icon("plus")}Nova coluna
          </button>
        </div>
      </div>
    </section>`;
  }
  sidebar(state) {
    return html`<aside class="panel rounded-3xl p-4 sm:p-5">
      <div class="mb-5 flex items-center justify-between">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[.2em] text-[var(--soft)]"
          >
            Quadros
          </p>
          <h2 class="mt-1 text-lg font-bold">Área de trabalho</h2>
        </div>
        <button
          class="btn icon-btn"
          aria-label="Novo quadro"
          data-action="open-board-create"
        >
          ${icon("plus", 18)}
        </button>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        ${state.boardOrder.map((id, index) => this.boardItem(state.boards[id], id === state.activeBoardId, index, state.boardOrder.length)).join("")}
      </div>
    </aside>`;
  }
  boardItem(board, active, index, total) {
    if (!board) return "";
    const stateClass = active
      ? "border-transparent bg-[var(--accent)] text-white"
      : "border-[var(--border)] bg-[var(--surface)]";
    return html`<article
      class="group rounded-3xl border p-4 transition ${stateClass}"
      role="button"
      tabindex="0"
      data-action="select-board"
      data-id="${board.id}"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 gap-3">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/10"
            >${icon("folder", 18)}</span
          >
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">
              ${escapeHtml(board.name)}
            </p>
            <p
              class="mt-1 line-clamp-2 text-xs ${active ? "text-white/75" : "text-[var(--muted)]"}"
            >
              ${escapeHtml(board.description || "Sem descrição")}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <button
            class="btn btn-ghost icon-btn h-8 w-8"
            ${index === 0 ? "disabled" : ""}
            aria-label="Mover para cima"
            data-action="move-board"
            data-id="${board.id}"
            data-direction="up"
          >
            ${icon("up", 14)}</button
          ><button
            class="btn btn-ghost icon-btn h-8 w-8"
            ${index === total - 1 ? "disabled" : ""}
            aria-label="Mover para baixo"
            data-action="move-board"
            data-id="${board.id}"
            data-direction="down"
          >
            ${icon("down", 14)}
          </button>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button
          class="btn btn-secondary flex-1 rounded-full px-3 py-2 text-xs"
          data-action="open-board-edit"
          data-id="${board.id}"
        >
          ${icon("edit", 14)}Editar</button
        ><button
          class="btn btn-danger flex-1 rounded-full px-3 py-2 text-xs"
          ${total === 1 ? "disabled" : ""}
          data-action="delete-board"
          data-id="${board.id}"
        >
          ${icon("trash", 14)}Remover
        </button>
      </div>
    </article>`;
  }
  workspace(data) {
    const { board, columns, cardsByColumn } = data;
    return html`<section class="panel rounded-3xl p-4 sm:p-5">
      <div
        class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex items-start gap-3">
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]"
            >${icon("layers", 20)}</span
          >
          <div>
            <h2 class="text-xl font-bold sm:text-2xl">
              ${escapeHtml(board.name)}
            </h2>
            <p class="mt-1 text-sm text-[var(--muted)]">
              ${escapeHtml(board.description || "Sem descrição para este quadro.")}
            </p>
          </div>
        </div>
        <button
          class="btn"
          data-action="open-card-create"
          data-column-id="${columns[0]?.id ?? ""}"
          ${columns.length ? "" : "disabled"}
        >
          ${icon("plus")}Cartão rápido
        </button>
      </div>
      <div
        class="-mx-4 flex min-h-[26rem] gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0"
      >
        ${columns.map((column) => this.columnItem(column, cardsByColumn[column.id] ?? [])).join("")}
      </div>
    </section>`;
  }
  columnItem(column, cards) {
    return html`<section
      class="kanban-column panel rounded-3xl bg-[var(--surface)] p-4"
      draggable="true"
      data-drag-type="column"
      data-id="${column.id}"
    >
      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-[var(--soft)]">${icon("grip")}</span>
          <div>
            <h3 class="text-sm font-semibold">${escapeHtml(column.title)}</h3>
            <p class="text-xs text-[var(--soft)]">
              ${cards.length} ${cards.length === 1 ? "cartão" : "cartões"}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="btn btn-secondary icon-btn"
            aria-label="Editar coluna"
            data-action="open-column-edit"
            data-id="${column.id}"
          >
            ${icon("edit", 14)}</button
          ><button
            class="btn btn-danger icon-btn"
            aria-label="Excluir coluna"
            data-action="delete-column"
            data-id="${column.id}"
          >
            ${icon("trash", 14)}
          </button>
        </div>
      </div>
      <button
        class="btn btn-secondary mb-4 w-full rounded-full"
        data-action="open-card-create"
        data-column-id="${column.id}"
      >
        ${icon("plus", 14)}Novo cartão
      </button>
      <div
        class="drop-zone flex min-h-28 flex-col gap-3 rounded-3xl border border-dashed border-[var(--border)] p-2"
        data-column-id="${column.id}"
      >
        ${cards.length ? cards.map((card) => this.cardItem(card)).join("") : '<div class="flex flex-1 items-center justify-center rounded-2xl bg-[var(--panel)] px-4 py-8 text-center text-sm text-[var(--muted)]">Solte cartões aqui ou crie uma nova tarefa.</div>'}
      </div>
    </section>`;
  }
  cardItem(card) {
    return html`<article
      class="kanban-card rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-lg"
      draggable="true"
      data-drag-type="card"
      data-id="${card.id}"
      data-column-id="${card.columnId}"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex flex-wrap gap-2">
            <span
              class="rounded-full px-2 py-1 text-xs font-semibold ${priorityClass[card.priority]}"
              >${escapeHtml(card.priority)}</span
            ><span
              class="rounded-full bg-[var(--surface-strong)] px-2 py-1 text-xs text-[var(--muted)]"
              >${escapeHtml(card.area)}</span
            >
          </div>
          <h4 class="mt-3 text-sm font-semibold">${escapeHtml(card.title)}</h4>
          <p class="truncate-3 mt-2 text-sm text-[var(--muted)]">
            ${escapeHtml(card.description || "Nenhum detalhe informado.")}
          </p>
        </div>
        <span class="text-[var(--soft)]">${icon("grip")}</span>
      </div>
      <div class="mt-4 grid gap-2 text-xs text-[var(--muted)]">
        <p class="flex items-center gap-2">
          ${icon("user", 14)}${escapeHtml(card.assignee || "Não atribuído")}
        </p>
        <p class="flex items-center gap-2">
          ${icon("calendar", 14)}${escapeHtml(card.dueDate || "Sem data limite")}
        </p>
        <p class="flex items-center gap-2">
          ${icon("tag", 14)}${escapeHtml(card.area)}
        </p>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          class="btn btn-secondary flex-1 rounded-full px-3 py-2 text-xs"
          data-action="open-card-edit"
          data-id="${card.id}"
        >
          ${icon("edit", 14)}Editar</button
        ><button
          class="btn btn-danger icon-btn"
          aria-label="Excluir cartão"
          data-action="delete-card"
          data-id="${card.id}"
        >
          ${icon("trash", 14)}
        </button>
      </div>
    </article>`;
  }
  emptyWorkspace() {
    return html`<section
      class="panel flex min-h-96 flex-col items-center justify-center rounded-3xl p-6 text-center"
    >
      <h2 class="text-xl font-bold">Nenhum quadro ativo</h2>
      <p class="mt-3 max-w-md text-sm text-[var(--muted)]">
        Crie o primeiro quadro para começar a organizar sua esteira de entrega
        de T.I.
      </p>
      <button class="btn mt-6" data-action="open-board-create">
        ${icon("folder")}Criar quadro
      </button>
    </section>`;
  }
  showModal(type, mode, value = {}, columnId = "") {
    const isCard = type === "card";
    const title = `${mode === "create" ? "Criar" : "Editar"} ${type === "board" ? "quadro" : type === "column" ? "coluna" : "cartão"}`;
    const fields = isCard
      ? this.cardFields(value)
      : type === "board"
        ? this.boardFields(value)
        : this.columnFields(value);
    this.modal.innerHTML = html`<div
      class="modal-backdrop"
      data-action="close-modal"
    >
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        data-modal-panel
      >
        <div class="mb-6">
          <h2 id="modal-title" class="text-xl font-bold">${title}</h2>
          <p class="mt-2 text-sm text-[var(--muted)]">
            ${isCard ? "Capture o contexto essencial de entrega para a tarefa." : type === "board" ? "Defina o espaço do projeto e um contexto breve para a equipe." : "Use etapas curtas de fluxo que toda a equipe entenda."}
          </p>
        </div>
        <form
          data-form-type="${type}"
          data-mode="${mode}"
          data-id="${escapeHtml(value.id || "")}"
          data-column-id="${escapeHtml(columnId)}"
          class="grid gap-5"
        >
          ${fields}
          <div class="mt-3 flex justify-end gap-3">
            <button
              type="button"
              class="btn btn-ghost"
              data-action="close-modal"
            >
              ${icon("close")}Cancelar</button
            ><button class="btn" type="submit">
              ${icon(mode === "create" ? "plus" : "save")}${mode === "create" ? "Criar" : "Salvar alterações"}
            </button>
          </div>
        </form>
      </section>
    </div>`;
    this.refreshIcons();
    this.modal.querySelector("input, textarea, select")?.focus();
  }
  boardFields(v) {
    return html`<label class="label"
        >Nome do quadro<input
          class="input"
          name="name"
          required
          maxlength="100"
          value="${escapeHtml(v.name || "")}"
          placeholder="Migração da plataforma" /></label
      ><label class="label"
        >Descrição<textarea
          class="input min-h-28 resize-y"
          name="description"
          maxlength="500"
          placeholder="O que este quadro acompanha?"
        >
${escapeHtml(v.description || "")}</textarea>
      </label>`;
  }
  columnFields(v) {
    return html`<label class="label"
      >Título da coluna<input
        class="input"
        name="title"
        required
        maxlength="60"
        value="${escapeHtml(v.title || "")}"
        placeholder="Validação de QA"
    /></label>`;
  }
  cardFields(v) {
    const options = (items, selected) =>
      items
        .map(
          (item) =>
            `<option ${item === selected ? "selected" : ""}>${item}</option>`,
        )
        .join("");
    return html`<label class="label"
        >Título<input
          class="input"
          name="title"
          required
          maxlength="120"
          value="${escapeHtml(v.title || "")}"
          placeholder="Adicionar testes de integração" /></label
      ><label class="label"
        >Descrição<textarea
          class="input min-h-24 resize-y"
          name="description"
          maxlength="1000"
          placeholder="Notas técnicas relevantes."
        >
${escapeHtml(v.description || "")}</textarea>
      </label>
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="label"
          >Prioridade<select class="input" name="priority">
            ${options(PRIORITIES, v.priority || "Média")}
          </select></label
        ><label class="label"
          >Área<select class="input" name="area">
            ${options(AREAS, v.area || "Frontend")}
          </select></label
        >
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="label"
          >Responsável<input
            class="input"
            name="assignee"
            maxlength="80"
            value="${escapeHtml(v.assignee || "")}"
            placeholder="Pessoa responsável" /></label
        ><label class="label"
          >Data limite<input
            class="input"
            name="dueDate"
            type="date"
            value="${escapeHtml(v.dueDate || "")}"
        /></label>
      </div>`;
  }
  closeModal() {
    this.modal.innerHTML = "";
  }
  notify(message, isError = false) {
    const item = document.createElement("div");
    item.className = `toast${isError ? " error" : ""}`;
    item.textContent = message;
    this.toasts.append(item);
    window.setTimeout(() => item.remove(), 2800);
  }
  refreshIcons() {
    window.lucide?.createIcons();
  }
}
