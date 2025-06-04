import express, { RequestHandler } from 'express';
import { createVenue, getAllVenues } from '../controllers/venueController';

const venueRouter = express.Router();

venueRouter.post('/', (req, res, next) => {
    console.log('🔥 venue POST route hit');
    next();
}, createVenue as RequestHandler);

// router.get('/test', (req, res) => {
//   res.send('✅ Venue test route is working');
// });
venueRouter.get('/', getAllVenues as RequestHandler);

export default venueRouter; 