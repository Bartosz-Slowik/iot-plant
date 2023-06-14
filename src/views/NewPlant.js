import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SliderPicker } from 'react-color';

function NewPlant() {

  const [plantData, setPlantData] = React.useState({
    name: 'Monstera Deliciosa',
    description:
      'The Monstera Deliciosa is a tropical plant native to Central America. It is known for its large, perforated leaves that have earned it the nickname "Swiss Cheese Plant".',
    img_url: 'https://source.unsplash.com/featured/?monstera',
    wetness: 80,
    rgbColor: { r: 0, g: 128, b: 0 },
    trigger: 50,
    device_number: 1,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlantData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { r, g, b } = plantData.rgbColor;
    const plantData2 = {
      device_number: data.get('device_number'),
      wetness: parseInt(data.get('wetness')),
      red: r,
      green: g,
      blue: b,
      name: data.get('name'),
      trigger: parseInt(data.get('trigger')),
      description: data.get('description'),
      img_url: data.get('img_url'),
    };
    console.log(plantData2);
    // Send a POST request to the API to add the new plant
    const response = await fetch('http://localhost:8000/api/newplant', {
      credentials: "include",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData2),
    });
    if (response.ok) {
      console.log('Plant added successfully!');
      window.location.href = '/MyPlants'; 
      // Redirect or perform any other action
    } else {
      console.error('Failed to add plant', response);
    }
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
                image={plantData.img_url}
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
                    id="device_number"
                    name="device_number"
                    label="device_number"
                    value={plantData.device_number}
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
                    id="img_url"
                    name="img_url"
                    label="image URL"
                    value={plantData.img_url}
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
                    id="trigger"
                    name="trigger"
                    label="trigger"
                    type="number"
                    value={plantData.trigger}
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

export default NewPlant;