export const PRIORITIES = ["Baixa", "Média", "Alta", "Crítica"];
export const AREAS = ["Frontend", "Backend", "DevOps", "Bug", "Produto"];
const DEFAULT_COLUMNS = [
  "Pendências",
  "A Fazer",
  "Em Progresso",
  "Revisão de Código",
  "Concluído",
];

const id = (prefix) =>
  `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const now = () => new Date().toISOString();
const text = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
const description = (value) => String(value ?? "").trim();
const reorder = (ids, activeId, overId) => {
  const from = ids.indexOf(activeId);
  const to = ids.indexOf(overId);
  if (from < 0 || to < 0 || from === to) return ids;
  const next = [...ids];
  next.splice(from, 1);
  next.splice(to, 0, activeId);
  return next;
};

export function emptyState() {
  return {
    boards: {},
    columns: {},
    cards: {},
    boardOrder: [],
    activeBoardId: "",
  };
}
export function boardView(state) {
  const board = state.boards[state.activeBoardId] ?? null;
  const columns = board
    ? board.columnIds.map((key) => state.columns[key]).filter(Boolean)
    : [];
  return {
    board,
    columns,
    cardsByColumn: Object.fromEntries(
      columns.map((column) => [
        column.id,
        column.cardIds.map((key) => state.cards[key]).filter(Boolean),
      ]),
    ),
  };
}
export function createBoard(state, draft) {
  const name = text(draft.name);
  if (!name) return null;
  const boardId = id("board");
  const timestamp = now();
  const columns = { ...state.columns };
  const columnIds = DEFAULT_COLUMNS.map((title) => {
    const columnId = id("column");
    columns[columnId] = {
      id: columnId,
      boardId,
      title,
      cardIds: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    return columnId;
  });
  return {
    ...state,
    columns,
    boards: {
      ...state.boards,
      [boardId]: {
        id: boardId,
        name,
        description: description(draft.description),
        columnIds,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    boardOrder: [...state.boardOrder, boardId],
    activeBoardId: boardId,
  };
}
export function updateBoard(state, boardId, draft) {
  const board = state.boards[boardId];
  const name = text(draft.name);
  if (!board || !name) return null;
  return {
    ...state,
    boards: {
      ...state.boards,
      [boardId]: {
        ...board,
        name,
        description: description(draft.description),
        updatedAt: now(),
      },
    },
  };
}
export function deleteBoard(state, boardId) {
  const board = state.boards[boardId];
  if (!board || state.boardOrder.length <= 1) return null;
  const columns = { ...state.columns };
  const cards = { ...state.cards };
  board.columnIds.forEach((columnId) => {
    (columns[columnId]?.cardIds ?? []).forEach(
      (cardId) => delete cards[cardId],
    );
    delete columns[columnId];
  });
  const boardOrder = state.boardOrder.filter((key) => key !== boardId);
  const boards = { ...state.boards };
  delete boards[boardId];
  return {
    ...state,
    boards,
    columns,
    cards,
    boardOrder,
    activeBoardId:
      state.activeBoardId === boardId ? boardOrder[0] : state.activeBoardId,
  };
}
export function selectBoard(state, boardId) {
  return state.boards[boardId] ? { ...state, activeBoardId: boardId } : null;
}
export function moveBoard(state, boardId, direction) {
  const index = state.boardOrder.indexOf(boardId);
  const target = index + (direction === "up" ? -1 : 1);
  if (index < 0 || target < 0 || target >= state.boardOrder.length) return null;
  const boardOrder = [...state.boardOrder];
  [boardOrder[index], boardOrder[target]] = [
    boardOrder[target],
    boardOrder[index],
  ];
  return { ...state, boardOrder };
}
export function createColumn(state, draft) {
  const board = state.boards[state.activeBoardId];
  const title = text(draft.title);
  if (!board || !title) return null;
  const columnId = id("column");
  const timestamp = now();
  return {
    ...state,
    boards: {
      ...state.boards,
      [board.id]: {
        ...board,
        columnIds: [...board.columnIds, columnId],
        updatedAt: timestamp,
      },
    },
    columns: {
      ...state.columns,
      [columnId]: {
        id: columnId,
        boardId: board.id,
        title,
        cardIds: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
  };
}
export function updateColumn(state, columnId, draft) {
  const column = state.columns[columnId];
  const title = text(draft.title);
  if (!column || !title) return null;
  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: { ...column, title, updatedAt: now() },
    },
  };
}
export function deleteColumn(state, columnId) {
  const column = state.columns[columnId];
  const board = column && state.boards[column.boardId];
  if (!column || !board) return null;
  const columns = { ...state.columns };
  const cards = { ...state.cards };
  delete columns[columnId];
  column.cardIds.forEach((key) => delete cards[key]);
  return {
    ...state,
    columns,
    cards,
    boards: {
      ...state.boards,
      [board.id]: {
        ...board,
        columnIds: board.columnIds.filter((key) => key !== columnId),
        updatedAt: now(),
      },
    },
  };
}
export function moveColumn(state, activeId, overId) {
  const board = state.boards[state.activeBoardId];
  if (!board) return null;
  const columnIds = reorder(board.columnIds, activeId, overId);
  return columnIds === board.columnIds
    ? null
    : {
        ...state,
        boards: {
          ...state.boards,
          [board.id]: { ...board, columnIds, updatedAt: now() },
        },
      };
}
export function createCard(state, columnId, draft) {
  const column = state.columns[columnId];
  const title = text(draft.title);
  if (!column || !title) return null;
  const cardId = id("card");
  const timestamp = now();
  const card = {
    id: cardId,
    columnId,
    title,
    description: description(draft.description),
    priority: PRIORITIES.includes(draft.priority) ? draft.priority : "Média",
    area: AREAS.includes(draft.area) ? draft.area : "Frontend",
    assignee: text(draft.assignee),
    dueDate: draft.dueDate || "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...column,
        cardIds: [...column.cardIds, cardId],
        updatedAt: timestamp,
      },
    },
    cards: { ...state.cards, [cardId]: card },
  };
}
export function updateCard(state, cardId, draft) {
  const card = state.cards[cardId];
  const title = text(draft.title);
  if (!card || !title) return null;
  return {
    ...state,
    cards: {
      ...state.cards,
      [cardId]: {
        ...card,
        title,
        description: description(draft.description),
        priority: draft.priority,
        area: draft.area,
        assignee: text(draft.assignee),
        dueDate: draft.dueDate || "",
        updatedAt: now(),
      },
    },
  };
}
export function deleteCard(state, cardId) {
  const card = state.cards[cardId];
  const column = card && state.columns[card.columnId];
  if (!card || !column) return null;
  const cards = { ...state.cards };
  delete cards[cardId];
  return {
    ...state,
    cards,
    columns: {
      ...state.columns,
      [column.id]: {
        ...column,
        cardIds: column.cardIds.filter((key) => key !== cardId),
        updatedAt: now(),
      },
    },
  };
}
export function moveCard(state, cardId, destinationColumnId, destinationIndex) {
  const card = state.cards[cardId];
  const source = card && state.columns[card.columnId];
  const destination = state.columns[destinationColumnId];
  if (!card || !source || !destination) return null;
  const sourceIds = source.cardIds.filter((key) => key !== cardId);
  const destinationIds =
    source.id === destination.id ? sourceIds : [...destination.cardIds];
  destinationIds.splice(
    Math.max(0, Math.min(destinationIndex, destinationIds.length)),
    0,
    cardId,
  );
  return {
    ...state,
    columns: {
      ...state.columns,
      [source.id]: {
        ...source,
        cardIds: source.id === destination.id ? destinationIds : sourceIds,
        updatedAt: now(),
      },
      ...(source.id === destination.id
        ? {}
        : {
            [destination.id]: {
              ...destination,
              cardIds: destinationIds,
              updatedAt: now(),
            },
          }),
    },
    cards: {
      ...state.cards,
      [cardId]: { ...card, columnId: destination.id, updatedAt: now() },
    },
  };
}
