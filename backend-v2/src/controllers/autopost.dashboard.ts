import { Request, Response } from 'express';
import ActivityLog from '../models/activityLog';

/**
 * PHASE 1 CRITICAL FIX: runNowToQueue function
 * This function schedules posts instead of posting immediately
 */
export const runNowToQueue = async (req: Request, res: Response) => {
  try {
    console.log('🔄 [RUN NOW TO QUEUE] Starting video queue process...');
    
    const { videoPath, originalCaption, platform } = req.body;
    
    // Calculate optimal posting time (simple implementation)
    const scheduledAt = new Date();
    scheduledAt.setHours(scheduledAt.getHours() + 2); // Schedule 2 hours from now
    
    console.log('📅 [SMART SCHEDULER] Optimal time calculated:', scheduledAt.toLocaleString());

    // Create activity log entry for the queued video
    const queueEntry = new ActivityLog({
      platform: platform || 'instagram',
      type: 'schedule',
      status: 'pending',
      message: '✅ Video successfully added to Smart Queue',
      caption: originalCaption,
      scheduledAt, // CRITICAL: This field was missing and causing the bug
      metadata: {
        scheduledBy: 'runNowToQueue',
        originalCaption,
        videoPath
      }
    });

    await queueEntry.save();
    
    console.log('✅ [RUN NOW TO QUEUE] Video queued successfully! Scheduled for:', scheduledAt.toLocaleString());

    res.status(200).json({ 
      message: '✅ Video added to Smart Queue', 
      scheduledAt,
      success: true
    });
  } catch (err) {
    console.error('[RunNowToQueue ERROR]', err);
    res.status(500).json({ error: 'Failed to queue video', success: false });
  }
};

/**
 * PHASE 1 FIX: Scheduler status endpoint
 */
export const getSchedulerStatus = async (req: Request, res: Response) => {
  try {
    console.log('📊 [SCHEDULER STATUS] Fetching queue status...');
    
    // Get all scheduled posts
    const scheduledPosts = await ActivityLog.find({
      type: 'schedule',
      status: 'pending',
      scheduledAt: { $exists: true }
    }).sort({ scheduledAt: 1 }).limit(10);

    const statusData = {
      running: scheduledPosts.length > 0,
      queuedPosts: scheduledPosts.length,
      nextScheduledPost: scheduledPosts.length > 0 ? scheduledPosts[0].scheduledAt : null,
      posts: scheduledPosts.map(post => ({
        id: post._id,
        platform: post.platform,
        scheduledAt: post.scheduledAt,
        status: post.status,
        message: post.message
      }))
    };

    console.log('📊 [SCHEDULER STATUS] Status retrieved:', statusData);
    res.status(200).json({ success: true, data: statusData });
  } catch (err) {
    console.error('[SCHEDULER STATUS ERROR]', err);
    res.status(500).json({ error: 'Failed to get scheduler status', success: false });
  }
};