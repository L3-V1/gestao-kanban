import { emptyState } from "../models/kanban-model.js";
const STORAGE_KEY = "kanban-project-management";
const validState = (value) =>
  value &&
  typeof value === "object" &&
  value.boards &&
  value.columns &&
  value.cards &&
  Array.isArray(value.boardOrder) &&
  typeof value.activeBoardId === "string";
export function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return validState(parsed) ? parsed : emptyState();
  } catch (error) {
    console.error("Não foi possível ler os dados do Kanban.", error);
    return emptyState();
  }
}
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Não foi possível salvar os dados do Kanban.", error);
  }
}
