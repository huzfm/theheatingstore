'use client';

import { create } from 'zustand';

/**
 * Shared experience state.
 *
 * Scope rule: only things multiple distant components must agree on live
 * here. Per-frame scroll values deliberately do NOT — they stay in refs
 * (see hooks/useScrollProgress.js) so they never trigger a render.
 */
export const useExperienceStore = create((set) => ({
  /* ── Cursor ───────────────────────────────────────────────────── */
  // 'default' | 'hover' | 'drag' | 'hidden'
  cursorVariant: 'default',
  cursorLabel: '',
  setCursor: (cursorVariant, cursorLabel = '') =>
    set({ cursorVariant, cursorLabel }),
  resetCursor: () => set({ cursorVariant: 'default', cursorLabel: '' }),

  /* ── Intro sequencing ─────────────────────────────────────────── */
  // Gates the hero's staggered entrance until the 3D scene is ready, so the
  // copy never animates in against an empty canvas.
  sceneReady: false,
  setSceneReady: (sceneReady) => set({ sceneReady }),
  introComplete: false,
  setIntroComplete: (introComplete) => set({ introComplete }),

  /* ── Floor reveal (Phase 3) ───────────────────────────────────── */
  // Coarse stage label, updated only on threshold crossings — not per frame.
  revealStage: 'floor', // 'floor' | 'sheet' | 'rotate'
  setRevealStage: (revealStage) => set({ revealStage }),

  /* ── Configurator (Phase 4) ───────────────────────────────────── */
  room: { width: 3.2, length: 4.0, preset: 'bedroom' },
  setRoom: (room) => set((s) => ({ room: { ...s.room, ...room } })),
}));

/** Non-reactive read, for use inside animation loops. */
export const getExperienceState = useExperienceStore.getState;
