import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; 
import './App.css';


const App = () => {
    const [analytics, setAnalytics] = useState({
        totalPageViews: 0,
        uniqueVisitors: 0,
        averageTimeSpent: 0,
    });
    const [visitorDetails, setVisitorDetails] = useState([]);
    const [page, setPage] = useState(1);
    const visitorsPerPage = 4;

    useEffect(() => {
      const visitorId = localStorage.getItem('visitorId') || Date.now().toString();
      localStorage.setItem('visitorId', visitorId);
  
      const visitTime = new Date();
      const browser = navigator.userAgent;
      const device = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  
      const fetchLocation = async () => {
          try {
              const response = await axios.get('https://ipapi.co/json/');
              const loc = `${response.data.city}, ${response.data.region}, ${response.data.country_name}`;
              return loc;
          } catch (error) {
              console.error('Error fetching location:', error);
              return 'Unknown location';
          }
      };
  
      fetchLocation().then((loc) => {
          const handleUnload = async () => {
              const leaveTime = new Date();
              const duration = (leaveTime - visitTime) / 1000; 
  
              const data = {
                  visitorId,
                  visitTime,
                  leaveTime,
                  duration,
                  browser,
                  location: loc,
                  device,
              };
  
              await axios.post('http://localhost:5001/api/analytics', data);
          };
  
          window.addEventListener('beforeunload', handleUnload);
  
          const fetchAnalytics = async () => {
              const result = await axios.get('http://localhost:5001/api/analytics');
              setAnalytics(result.data);
  
              const visitors = await axios.get('http://localhost:5001/api/visitor-details');
              setVisitorDetails(visitors.data);
          };
  
          fetchAnalytics();
  
          return () => {
              window.removeEventListener('beforeunload', handleUnload);
          };
      });
  }, [page]);

    const getChartData = () => {
        const labels = visitorDetails.map((detail, index) => `Visit ${index + 1}`);
        const data = visitorDetails.map(detail => detail.duration);

        return {
            labels,
            datasets: [
                {
                    label: 'Average Time Spent on Page',
                    data,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                },
            ],
        };
    };

    const renderVisitorDetails = () => {
        return visitorDetails.slice((page - 1) * visitorsPerPage, page * visitorsPerPage).map((detail, index) => (
            <div key={index} className="visitor-detail">
                <p>Visitor ID: {detail.visitorId}</p>
                <p>Visit Time: {new Date(detail.visitTime).toLocaleString()}</p>
                <p>Leave Time: {new Date(detail.leaveTime).toLocaleString()}</p>
                <p>Duration: {detail.duration} seconds</p>
                <p>Browser: {detail.browser}</p>
            <p>Location: {detail.location}</p>
            <p>Device: {detail.device}</p>
            </div>
        ));
    };

    const totalPages = Math.ceil(visitorDetails.length / visitorsPerPage);
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button key={i} onClick={() => setPage(i)} className={i === page ? 'active' : ''}>
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="dashboard">
                      <div className="graph" style={{ height: '500px', width: '1000px' }}>
                <Line data={getChartData()} />
            </div>
          <div className='col'>
            <div className="row">
                <h1>Analytics Dashboard</h1>
                <div className="grid-container">
      <div className="grid-item">Total Page Views: {analytics.totalPageViews}</div>
      <div className="grid-item">Unique Visitors: {analytics.uniqueVisitors}</div>
      <div className="grid-item">Average Time Spent on Page: {analytics.averageTimeSpent} seconds</div>
    </div>
            </div>
            <div className="row">
                <h2>Visitor Details</h2>
                <div className="visitor-details">
                    {renderVisitorDetails()}
                </div>
                <div className="pagination">
                    <button onClick={() => setPage(page => Math.max(page - 1, 1))} disabled={page === 1}>
                        Previous
                    </button>
                    {renderPageNumbers()}
                    <button onClick={() => setPage(page => Math.min(page + 1, totalPages))} disabled={page === totalPages}>
                        Next
                    </button>
                </div>
            </div>
            </div>

        </div>
    );
};

export default App;

