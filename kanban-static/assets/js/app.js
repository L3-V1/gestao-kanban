import { KanbanController } from "./controllers/kanban-controller.js";
import { KanbanView } from "./views/kanban-view.js";

const view = new KanbanView(
  document.querySelector("#app"),
  document.querySelector("#modal-root"),
  document.querySelector("#toast-root"),
);
const controller = new KanbanController(render, (message, isError) =>
  view.notify(message, isError),
);
let dragged = null;

function render() {
  view.render(controller.state, controller.getView());
}
function confirmDelete(message) {
  return window.confirm(message);
}
function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function openModal(action, element) {
  const id = element.dataset.id;
  if (action === "open-board-create") view.showModal("board", "create");
  if (action === "open-board-edit")
    view.showModal("board", "edit", controller.state.boards[id]);
  if (action === "open-column-create") view.showModal("column", "create");
  if (action === "open-column-edit")
    view.showModal("column", "edit", controller.state.columns[id]);
  if (action === "open-card-create")
    view.showModal("card", "create", {}, element.dataset.columnId);
  if (action === "open-card-edit")
    view.showModal("card", "edit", controller.state.cards[id]);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id, direction } = target.dataset;
  if (action === "close-modal") {
    if (target.tagName === "BUTTON" || event.target === target)
      view.closeModal();
    return;
  }
  if (action.startsWith("open-")) {
    openModal(action, target);
    return;
  }
  if (action === "select-board") {
    controller.selectBoard(id);
    return;
  }
  if (action === "move-board") {
    controller.moveBoard(id, direction);
    return;
  }
  if (
    action === "delete-board" &&
    confirmDelete("Remover este quadro e todas as suas tarefas?")
  )
    controller.deleteBoard(id);
  if (
    action === "delete-column" &&
    confirmDelete("Remover esta coluna e todos os seus cartões?")
  )
    controller.deleteColumn(id);
  if (action === "delete-card" && confirmDelete("Remover este cartão?"))
    controller.deleteCard(id);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") view.closeModal();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("form[data-form-type]");
  if (!form) return;
  event.preventDefault();
  const draft = formData(form);
  const { formType, mode, id, columnId } = form.dataset;
  const method = `${mode === "create" ? "create" : "update"}${formType[0].toUpperCase()}${formType.slice(1)}`;
  const successful =
    formType === "card" && mode === "create"
      ? controller.createCard(columnId, draft)
      : mode === "edit"
        ? controller[method](id, draft)
        : controller[method](draft);
  if (successful) view.closeModal();
});

document.addEventListener("dragstart", (event) => {
  const item = event.target.closest('[draggable="true"]');
  if (!item) return;
  dragged = {
    type: item.dataset.dragType,
    id: item.dataset.id,
    columnId: item.dataset.columnId,
  };
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", dragged.id);
  item.classList.add("dragging");
});
document.addEventListener("dragend", (event) => {
  event.target.closest('[draggable="true"]')?.classList.remove("dragging");
  document
    .querySelectorAll(".drag-over")
    .forEach((item) => item.classList.remove("drag-over"));
  dragged = null;
});
document.addEventListener("dragover", (event) => {
  if (!dragged) return;
  const zone = event.target.closest(
    dragged.type === "card" ? ".drop-zone" : '[data-drag-type="column"]',
  );
  if (!zone || zone.dataset.id === dragged.id) return;
  event.preventDefault();
  zone.classList.add("drag-over");
  event.dataTransfer.dropEffect = "move";
});
document.addEventListener("dragleave", (event) =>
  event.target.closest(".drag-over")?.classList.remove("drag-over"),
);
document.addEventListener("drop", (event) => {
  if (!dragged) return;
  const zone = event.target.closest(
    dragged.type === "card" ? ".drop-zone" : '[data-drag-type="column"]',
  );
  if (!zone || zone.dataset.id === dragged.id) return;
  event.preventDefault();
  if (dragged.type === "column")
    controller.moveColumn(dragged.id, zone.dataset.id);
  else {
    const targetCard = event.target.closest('[data-drag-type="card"]');
    const index = targetCard
      ? [...zone.querySelectorAll('[data-drag-type="card"]')].indexOf(
          targetCard,
        )
      : zone.querySelectorAll('[data-drag-type="card"]').length;
    controller.moveCard(dragged.id, zone.dataset.columnId, index);
  }
});

render();
