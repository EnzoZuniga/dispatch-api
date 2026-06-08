import { IMissionRepository } from './repository';
import { Mission } from './types';
import { 
  CreateMissionInput, 
  UpdateMissionInput, 
  AssignMissionInput,
  UpdateStatusInput 
} from './schemas';
import { NotFoundError, ConflictError } from '../../errors';
import { isTransitionAllowed, MissionStatus } from '../../domain/transitions';

export class MissionService {
  constructor(private missionRepo: IMissionRepository) {}

  async listMissions(): Promise<Mission[]> {
    return this.missionRepo.findAll();
  }

  async getMission(id: string): Promise<Mission> {
    const mission = await this.missionRepo.findById(id);
    if (!mission) {
      throw new NotFoundError('Mission');
    }
    return mission;
  }

  async createMission(input: CreateMissionInput): Promise<Mission> {
    return this.missionRepo.create(input);
  }

  async updateMission(id: string, input: UpdateMissionInput): Promise<Mission> {
    const mission = await this.getMission(id);
    return this.missionRepo.update(id, input);
  }

  async deleteMission(id: string): Promise<void> {
    await this.getMission(id);
    return this.missionRepo.delete(id);
  }

  async assignMission(id: string, input: AssignMissionInput): Promise<Mission> {
    const mission = await this.getMission(id);

    if (mission.status !== 'draft') {
      throw new ConflictError('Mission can only be assigned from draft status');
    }

    await this.missionRepo.update(id, {
      technicianId: input.technicianId,
    });

    // Passage auto en assigned une fois le tech posé
    return this.updateStatus(id, { status: 'assigned' });
  }

  async updateStatus(id: string, input: UpdateStatusInput): Promise<Mission> {
    const mission = await this.getMission(id);

    if (!isTransitionAllowed(mission.status, input.status)) {
      throw new ConflictError(
        `Cannot transition from ${mission.status} to ${input.status}`
      );
    }

    return this.missionRepo.update(id, { status: input.status });
  }
}
