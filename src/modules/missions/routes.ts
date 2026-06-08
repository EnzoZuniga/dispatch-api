import { Router } from 'express';
import { MissionService } from './service';
import { InMemoryMissionRepository } from './repository';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createMissionSchema,
  updateMissionSchema,
  assignMissionSchema,
  updateStatusSchema,
} from './schemas';

const router = Router();
const missionService = new MissionService(new InMemoryMissionRepository());

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const missions = await missionService.listMissions();
    res.json(missions);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const mission = await missionService.getMission(req.params.id);
    res.json(mission);
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(createMissionSchema), async (req, res, next) => {
  try {
    const mission = await missionService.createMission(req.body);
    res.status(201).json(mission);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validate(updateMissionSchema), async (req, res, next) => {
  try {
    const mission = await missionService.updateMission(req.params.id, req.body);
    res.json(mission);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await missionService.deleteMission(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/:id/assign', validate(assignMissionSchema), async (req, res, next) => {
  try {
    const mission = await missionService.assignMission(req.params.id, req.body);
    res.json(mission);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', validate(updateStatusSchema), async (req, res, next) => {
  try {
    const mission = await missionService.updateStatus(req.params.id, req.body);
    res.json(mission);
  } catch (error) {
    next(error);
  }
});

export default router;
