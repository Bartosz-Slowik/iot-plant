import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function SampleHistory() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [moistureHistory, setMoistureHistory] = React.useState([
    { date: '2021-10-01', value: 70 },
    { date: '2021-10-02', value: 60 },
    { date: '2021-10-03', value: 55 },
    { date: '2021-10-04', value: 50 },
    { date: '2021-10-05', value: 47 },
    { date: '2021-10-06', value: 90 },
    { date: '2021-10-07', value: 80 },
    { date: '2021-10-08', value: 75 },
  ]);

  const chartData = moistureHistory.map((data) => ({ date: data.date, value: data.value }));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 2,
              pb: 2,
              overflowX: isSmallScreen ? 'hidden' : 'auto',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ paddingLeft: isSmallScreen ? 0 : 2 }}>
                <Card sx={{ maxWidth: isSmallScreen ? 600 : 800 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <img
                    src="https://source.unsplash.com/featured/?plant"
                    alt="Plant"
                    width="100%"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                    sx={{ mr: 2 }}
                  />
                </Box>
                    <Typography variant="h6" component="h3" align="center" gutterBottom>
                      Moisture History
                    </Typography>
                    <LineChart width={isSmallScreen ? 400 : 700} height={isSmallScreen ? 300 : 400} data={chartData}>
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
          </Box>
        </main>
      </Box>
    </ThemeProvider>
  );
}