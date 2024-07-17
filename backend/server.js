const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.REACT_APP_MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const analyticsSchema = new mongoose.Schema({
    visitorId: String,
    visitTime: Date,
    leaveTime: Date,
    duration: Number,
    browser: String,
    location: String,
    device: String,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

app.post('/api/analytics', async (req, res) => {
    console.log('Incoming data:', req.body);
    const data = new Analytics(req.body);
    await data.save();
    console.log('Data saved to MongoDB');
    res.sendStatus(200);
});

app.get('/api/analytics', async (req, res) => {
    const totalPageViews = await Analytics.countDocuments();
    const uniqueVisitorsArray = await Analytics.distinct('visitorId');
    const uniqueVisitors = uniqueVisitorsArray.length;
    const averageTimeSpent = await Analytics.aggregate([
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } },
    ]);

    const avgTimeSpent = averageTimeSpent[0]?.avgDuration ? averageTimeSpent[0].avgDuration.toFixed(2) : 0;

    console.log('Analytics data:', {
        totalPageViews,
        uniqueVisitors,
        averageTimeSpent: avgTimeSpent,
    });

    res.json({
        totalPageViews,
        uniqueVisitors,
        averageTimeSpent: avgTimeSpent,
    });
});

app.get('/api/visitor-details', async (req, res) => {
    const visitorDetails = await Analytics.find({}, 'visitorId visitTime leaveTime duration browser location device').sort({ visitTime: -1 }).exec();
    res.json(visitorDetails);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});