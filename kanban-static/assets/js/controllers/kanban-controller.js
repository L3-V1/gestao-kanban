import * as model from "../models/kanban-model.js";
import { loadState, saveState } from "../services/storage-service.js";

export class KanbanController {
  constructor(onChange, notify) {
    this.state = loadState();
    this.onChange = onChange;
    this.notify = notify;
  }
  getView() {
    return model.boardView(this.state);
  }
  commit(nextState, success, failure) {
    if (!nextState) {
      this.notify(failure, true);
      return false;
    }
    this.state = nextState;
    saveState(this.state);
    this.onChange();
    this.notify(success);
    return true;
  }
  createBoard(draft) {
    return this.commit(
      model.createBoard(this.state, draft),
      "Quadro criado com sucesso.",
      "Informe um nome válido para criar o quadro.",
    );
  }
  updateBoard(id, draft) {
    return this.commit(
      model.updateBoard(this.state, id, draft),
      "Quadro atualizado com sucesso.",
      "Não foi possível atualizar o quadro.",
    );
  }
  deleteBoard(id) {
    return this.commit(
      model.deleteBoard(this.state, id),
      "Quadro removido com sucesso.",
      "É necessário manter pelo menos um quadro.",
    );
  }
  selectBoard(id) {
    const next = model.selectBoard(this.state, id);
    if (next) {
      this.state = next;
      saveState(next);
      this.onChange();
    }
  }
  moveBoard(id, direction) {
    const next = model.moveBoard(this.state, id, direction);
    if (next) {
      this.state = next;
      saveState(next);
      this.onChange();
    }
  }
  createColumn(draft) {
    return this.commit(
      model.createColumn(this.state, draft),
      "Coluna criada com sucesso.",
      "Selecione um quadro e informe um título válido.",
    );
  }
  updateColumn(id, draft) {
    return this.commit(
      model.updateColumn(this.state, id, draft),
      "Coluna atualizada com sucesso.",
      "Não foi possível atualizar a coluna.",
    );
  }
  deleteColumn(id) {
    return this.commit(
      model.deleteColumn(this.state, id),
      "Coluna removida com sucesso.",
      "Não foi possível remover a coluna.",
    );
  }
  moveColumn(id, overId) {
    const next = model.moveColumn(this.state, id, overId);
    if (next) {
      this.state = next;
      saveState(next);
      this.onChange();
    }
  }
  createCard(columnId, draft) {
    return this.commit(
      model.createCard(this.state, columnId, draft),
      "Cartão criado com sucesso.",
      "Informe um título válido para criar o cartão.",
    );
  }
  updateCard(id, draft) {
    return this.commit(
      model.updateCard(this.state, id, draft),
      "Cartão atualizado com sucesso.",
      "Não foi possível atualizar o cartão.",
    );
  }
  deleteCard(id) {
    return this.commit(
      model.deleteCard(this.state, id),
      "Cartão removido com sucesso.",
      "Não foi possível remover o cartão.",
    );
  }
  moveCard(id, columnId, index) {
    const next = model.moveCard(this.state, id, columnId, index);
    if (next) {
      this.state = next;
      saveState(next);
      this.onChange();
    }
  }
}
