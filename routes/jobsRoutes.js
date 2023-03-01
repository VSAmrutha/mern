import { createJob, deleteJob, getAllJobs, updateJob, showStats } from '../controllers/jobsController.js';
import express from 'express';
const router=express.Router();

router.route('/').get(getAllJobs).post(createJob)
router.route('/stats').get(showStats)
router.route('/:id').delete(deleteJob).patch(updateJob)

export default router;
