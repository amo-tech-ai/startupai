import { EventCoreService } from './events/core';
import { EventTaskService } from './events/tasks';
import { EventAssetService } from './events/assets';
import { EventFinanceService } from './events/finance';
import { EventAttendeeService } from './events/attendees';

/**
 * Events Service Facade
 * 
 * Aggregates all event-related database operations into a single interface.
 * Imports from modular sub-services to keep code organized.
 */
export const EventService = {
  // Core (CRUD)
  ...EventCoreService,
  
  // Sub-modules
  ...EventTaskService,
  ...EventAssetService,
  ...EventFinanceService,
  ...EventAttendeeService
};
