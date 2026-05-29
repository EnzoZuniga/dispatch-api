export type MissionStatus = 
  | 'draft' 
  | 'assigned' 
  | 'en_route' 
  | 'on_site' 
  | 'done' 
  | 'cancelled';

// Map des transitions autorisées pour chaque statut
const ALLOWED_TRANSITIONS: Record<MissionStatus, MissionStatus[]> = {
  draft: ['assigned', 'cancelled'],
  assigned: ['en_route', 'cancelled'],
  en_route: ['on_site', 'cancelled'],
  on_site: ['done', 'cancelled'],
  done: [],
  cancelled: [],
};

export function isTransitionAllowed(
  from: MissionStatus,
  to: MissionStatus
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(status: MissionStatus): MissionStatus[] {
  return ALLOWED_TRANSITIONS[status];
}
