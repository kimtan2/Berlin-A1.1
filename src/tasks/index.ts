// ============================================================================
// TASK CONFIGURATIONS INDEX
// ============================================================================

import { LUKAS_BÄCKEREI_TASK } from './lukasBaeckereiTask';
import { REWE_TASK } from './reweTask';
import { TIERGARTEN_TASK } from './tiergartenTask';

// Re-export individual tasks
export { LUKAS_BÄCKEREI_TASK } from './lukasBaeckereiTask';
export { REWE_TASK } from './reweTask';
export { TIERGARTEN_TASK } from './tiergartenTask';

// Task registry for easy access by location ID
export const TASK_REGISTRY = {
  lukas: LUKAS_BÄCKEREI_TASK,
  rewe: REWE_TASK,
  park: TIERGARTEN_TASK,
};

// Helper function to get task by location
export const getTaskByLocation = (location: string) => {
  return TASK_REGISTRY[location] || null;
};