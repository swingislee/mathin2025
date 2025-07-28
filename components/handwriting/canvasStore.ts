'use client';

import { create } from 'zustand';

type BoardRef = {
  id: string;
  name: string;
  clear: () => void;
 };

export type Tool =
  | 'pen'
  | 'eraserS' | 'eraserM' | 'eraserL'
  | 'strokeEraser'
  | 'pointer';

type CanvasControlState = {
  tool: Tool;
  color: string;
  sizePx: number;
  setTool: (t: Tool) => void;
  setColor: (c: string) => void;
  setSizePx: (n: number) => void;
  boards: BoardRef[];
  registerBoard: (id: string, name: string, clear: () => void) => void;
  unregisterBoard: (id: string) => void;
  clearBoards: (ids: string[]) => void;
  selectedBoardIds: string[];
  toggleSelectedBoard: (id: string) => void;
  resetSelectedBoards: () => void;
};

export const useCanvasControl = create<CanvasControlState>((set,get) => ({
  tool: 'pointer',
  color: '#000000',
  sizePx: 8,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setSizePx: (sizePx) => set({ sizePx }),
  boards: [],
  registerBoard: (id, name, clear) => {
    set(state => {
      const isFirst = state.boards.length === 0;
      const isMainName =
        name === '主画板' || name.toLowerCase() === 'main board';

      const shouldSelect = isMainName || isFirst;

      return {
        boards: [...state.boards, { id, name, clear }],
        selectedBoardIds: shouldSelect
          ? [...state.selectedBoardIds, id]
          : state.selectedBoardIds,
      };
    });
  },

  unregisterBoard: (id) => {
  set(state => ({
  boards: state.boards.filter(b => b.id !== id)
   }));
  },
  clearBoards: (ids) => {
   const { boards } = get();
   ids.forEach(id => {
    const board = boards.find(b => b.id === id);
     board?.clear();
      });
   },

  selectedBoardIds: [],
  toggleSelectedBoard: (id) => {
  const selected = get().selectedBoardIds;
   set({
     selectedBoardIds: selected.includes(id)
       ? selected.filter(x => x !== id)
       : [...selected, id]
    });
  },
  resetSelectedBoards: () => {
    set({ selectedBoardIds: [] });
  },
}));
