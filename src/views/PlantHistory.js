import * as React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function PlantHistory() {
  let { id } = useParams();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(id);
  const [moistureHistory, setMoistureHistory] = React.useState([]);
  const [img_url, setPlantImage] = React.useState([]);


  const fetchPlantData = async () => {
    
    console.log(id);
    const response = await fetch(`http://localhost:8000/api/plant/${id}`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setPlantImage({
        img_url: data.img_url,
      });
    } else {
      console.error('Failed to fetch plant data', response);
    }
  };

  React.useEffect(() => {
    fetchPlantData();
  }, []);




  const fetchPlantHistory = async () => {
    
    console.log(id);
    const response = await fetch(`http://localhost:8000/api/planthistory/${id}`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.Ok);
      const parsedData=data.Ok.map((data) => ({ date: data.date, value: data.wetness }));
      console.log(parsedData);
      setMoistureHistory(parsedData);
      
    } else {
      console.error('Failed to fetch plant data', response);
    }
  };

  React.useEffect(() => {
    fetchPlantHistory();
  }, []);





  

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
                    src={img_url.img_url}
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
export default PlantHistory;