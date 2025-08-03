import express from 'express';
import autopostRouter from './api/autopost';
import schedulerRouter from './api/scheduler';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend-v2',
    timestamp: new Date().toISOString()
  });
});

// PHASE 1 CRITICAL ROUTES
router.use('/autopost', autopostRouter);  // /api/autopost/run-now
router.use('/scheduler', schedulerRouter); // /api/scheduler/status

export default router;