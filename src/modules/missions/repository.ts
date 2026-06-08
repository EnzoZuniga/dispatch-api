import { Mission, CreateMissionInput, UpdateMissionInput } from './types';

// Interface pour permettre un remplacement facile par Prisma plus tard
export interface IMissionRepository {
  findAll(): Promise<Mission[]>;
  findById(id: string): Promise<Mission | null>;
  create(input: CreateMissionInput): Promise<Mission>;
  update(id: string, input: UpdateMissionInput): Promise<Mission>;
  delete(id: string): Promise<void>;
}

export class InMemoryMissionRepository implements IMissionRepository {
  private missions = new Map<string, Mission>();
  private idCounter = 1;

  async findAll(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }

  async findById(id: string): Promise<Mission | null> {
    return this.missions.get(id) || null;
  }

  async create(input: CreateMissionInput): Promise<Mission> {
    const mission: Mission = {
      id: `mission_${this.idCounter++}`,
      ...input,
      status: 'draft',
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.missions.set(mission.id, mission);
    return mission;
  }

  async update(id: string, input: UpdateMissionInput): Promise<Mission> {
    const mission = this.missions.get(id);
    if (!mission) {
      throw new Error('Mission not found');
    }

    const updated = {
      ...mission,
      ...input,
      updatedAt: new Date(),
    };

    this.missions.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.missions.delete(id);
  }
}
