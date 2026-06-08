import { MissionStatus } from '../../domain/transitions';

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  status: MissionStatus;
  technicianId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMissionInput = Pick<Mission, 'title' | 'description' | 'location'>;
export type UpdateMissionInput = Partial<
  Pick<Mission, 'title' | 'description' | 'location' | 'technicianId' | 'status'>
>;
