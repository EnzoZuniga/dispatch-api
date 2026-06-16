import { describe, it, expect } from 'vitest';
import { isTransitionAllowed, getAllowedTransitions } from '../domain/transitions';

describe('Mission Status Transitions', () => {
  it('should allow draft -> assigned', () => {
    expect(isTransitionAllowed('draft', 'assigned')).toBe(true);
  });

  it('should allow draft -> cancelled', () => {
    expect(isTransitionAllowed('draft', 'cancelled')).toBe(true);
  });

  it('should not allow draft -> en_route', () => {
    expect(isTransitionAllowed('draft', 'en_route')).toBe(false);
  });

  it('should allow assigned -> en_route', () => {
    expect(isTransitionAllowed('assigned', 'en_route')).toBe(true);
  });

  it('should allow en_route -> on_site', () => {
    expect(isTransitionAllowed('en_route', 'on_site')).toBe(true);
  });

  it('should allow on_site -> done', () => {
    expect(isTransitionAllowed('on_site', 'done')).toBe(true);
  });

  it('should not allow done -> any status', () => {
    expect(isTransitionAllowed('done', 'assigned')).toBe(false);
    expect(isTransitionAllowed('done', 'cancelled')).toBe(false);
  });

  it('should not allow cancelled -> any status', () => {
    expect(isTransitionAllowed('cancelled', 'draft')).toBe(false);
    expect(isTransitionAllowed('cancelled', 'assigned')).toBe(false);
  });

  it('should return correct allowed transitions for draft', () => {
    const allowed = getAllowedTransitions('draft');
    expect(allowed).toEqual(['assigned', 'cancelled']);
  });

  it('should return empty array for terminal statuses', () => {
    expect(getAllowedTransitions('done')).toEqual([]);
    expect(getAllowedTransitions('cancelled')).toEqual([]);
  });
});
