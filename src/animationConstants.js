/**
 * Shared animation constants used by both the reel builder (SlotMachine)
 * and the animation engine (useSlotAnimation). Single source of truth.
 */

export const SLOT_HEIGHT = 80;       // px per name slot
export const MAX_SPEED = 35;         // slots per second at full cruise
export const SPIN_UP_DURATION = 400; // ms
export const CRUISE_DURATION = 2100; // ms
export const DECEL_DURATION = 3000;  // ms
export const DECEL_SLOTS = 25;       // controlled decel distance in slots

// Derived
export const TOTAL_DURATION = SPIN_UP_DURATION + CRUISE_DURATION + DECEL_DURATION;
const spinUpDist = MAX_SPEED * SLOT_HEIGHT * (SPIN_UP_DURATION / 1000) * 0.5;
const cruiseDist = MAX_SPEED * SLOT_HEIGHT * (CRUISE_DURATION / 1000);
export const PRE_DECEL_SLOTS = Math.ceil((spinUpDist + cruiseDist) / SLOT_HEIGHT);
export const IDEAL_LANDING = PRE_DECEL_SLOTS + DECEL_SLOTS;
