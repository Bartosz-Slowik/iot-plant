import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SliderPicker } from 'react-color';
import { useParams } from 'react-router-dom';


function Plants(props) {
  let { id } = useParams();
  const [plantData, setPlantData] = React.useState({
    name: '',
    description: '',
    img_url: '',
    wetness: 0,
    rgbColor: { r: 0, g: 0, b: 0 },
    trigger: 0,
    device_number: 0,
  });

  const fetchPlantData = async () => {
    
    console.log(id);
    const response = await fetch(`http://localhost:8000/api/plant/${id}`, {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const rgbColor = `{${data.red}, ${data.green}, ${data.blue}}`;
      setPlantData({
        name: data.name,
        description: data.description,
        img_url: data.img_url,
        wetness: data.wetness,
        rgbColor: rgbColor,
        trigger: data.trigger,
        device_number: data.device_number,
      });
    } else {
      console.error('Failed to fetch plant data', response);
    }
  };

  React.useEffect(() => {
    fetchPlantData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlantData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/plant/${id}`, {
        credentials: "include",
        method: 'DELETE',
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to delete plant data');
      }
      // Redirect to the plants list page after successful deletion
      window.location.href = '/MyPlants';
    } catch (error) {
      console.error('Failed to delete plant data', error);
    }
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
    // Send a PUT request to the API to update the plant data
    const response = await fetch(`http://localhost:8000/api/plant/${id}`, {
      credentials: "include",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData2),
    });
    if (response.ok) {
      console.log('Plant data updated successfully!');
      window.location.href = '/MyPlants';
      // Redirect or perform any other action
    } else {
      console.error('Failed to update plant data', response);
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
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(plantData.id)}
                      sx={{ ml: 2 }}
                    >
                      Delete
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

export default Plants;