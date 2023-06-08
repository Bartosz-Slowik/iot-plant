import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SliderPicker } from 'react-color';

function Plant() {
  const [plantData, setPlantData] = React.useState({
    name: 'Monstera Deliciosa',
    description:
      'The Monstera Deliciosa is a tropical plant native to Central America. It is known for its large, perforated leaves that have earned it the nickname "Swiss Cheese Plant".',
    image: 'https://source.unsplash.com/featured/?monstera',
    wetness: 80,
    rgbColor: { r: 0, g: 128, b: 0 },
    threshold: 50,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlantData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(plantData);
  };

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
            <Card sx={{ maxWidth: 600 }}>
              <CardMedia
                component="img"
                height="400"
                image={plantData.image}
                alt={plantData.name}
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    value={plantData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    value={plantData.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="image"
                    name="image"
                    label="Image URL"
                    value={plantData.image}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="wetness"
                    name="wetness"
                    label="Wetness"
                    type="number"
                    value={plantData.wetness}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    id="threshold"
                    name="threshold"
                    label="Threshold"
                    type="number"
                    value={plantData.threshold}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <SliderPicker
                    color={plantData.rgbColor}
                    onChange={(color) =>
                      setPlantData((prevState) => ({
                        ...prevState,
                        rgbColor: color.rgb,
                      }))
                    }
                  />
                  <Box sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </main>
    </Box>
  );
}

export default Plant;