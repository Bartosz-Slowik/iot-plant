import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function PlantHistory() {
  const [moistureHistory, setMoistureHistory] = React.useState([
    { date: '2021-10-01', value: 70 },
    { date: '2021-10-02', value: 75 },
    { date: '2021-10-03', value: 80 },
    { date: '2021-10-04', value: 85 },
    { date: '2021-10-05', value: 90 },
    { date: '2021-10-06', value: 85 },
    { date: '2021-10-07', value: 80 },
  ]);

  const chartData = moistureHistory.map((data) => ({ date: data.date, value: data.value }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 2,
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ maxWidth: 800 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <img
                    src="https://via.placeholder.com/64x64.png?text=Plant"
                    alt="Plant"
                    width={64}
                    height={64}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="h5" component="h2">
                    Plant Name
                  </Typography>
                </Box>
                <Typography variant="h6" component="h3" align="center" gutterBottom>
                  Moisture History
                </Typography>
                <LineChart width={700} height={400} data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </main>
    </Box>
  );
}

export default PlantHistory;