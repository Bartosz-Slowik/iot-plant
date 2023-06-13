import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function MyPlants() {
  console.log('MyPlants');
  const [plants_list, setPlants] = React.useState([]);

  React.useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/myplants', {
          credentials: "include"
      });
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error(error);
        // Handle the error here, e.g. by showing an error message to the user
      }
    };
    
    fetchPlants();
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 2,
            pb: 2,
          }}
        >
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
              My Plants
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              A list of all your plants
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {plants_list.map((plant) => (
              <Grid item key={plant.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9 aspect ratio
                      pt: '56.25%',
                    }}
                    image={plant.image_url}
                    alt={plant.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {plant.name}
                    </Typography>
                    <Typography>
                      {plant.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </Box>
  );
}