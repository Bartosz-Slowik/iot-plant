import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SliderPicker } from 'react-color';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import axios from 'axios'; // Import axios
import IconButton from '@mui/material/IconButton'; // Import IconButton
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


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
  const [searchResults, setSearchResults] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(''); // Add a state for the search value
  const [isSearchEmpty, setIsSearchEmpty] = React.useState(false);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);

  };
  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/scrape', {
        query: searchValue
      });

      if (response.data.length === 0) {
        setIsSearchEmpty(true);
      } else {
        setIsSearchEmpty(false);
        setSearchResults(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      setIsSearchEmpty(true);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlantData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSelectPlant = async (result) => {
    setPlantData({
      ...plantData,
      name: result['Common Name'],
      description: result['Latin Name'],
    });

    try {
      console.log(result['link']);
      const response = await axios.post('http://localhost:8000/api/scrape2', { url: result['link'] });
      const data = response.data;
      console.log(data);
      setPlantData((prevState) => ({
        ...prevState,
        img_url: data[0], // Assuming this is the image URL
        description: data[1], // Assuming this is the description
      }));
    } catch (error) {
      console.error('Failed to fetch data', error);
    }

    setIsModalOpen(false);
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
      description: data.get('description').replace(/<\/?[^>]+(>|$)/g, "").replace(/\W+/g, ' '),
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
    } else {;
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
                <form onSubmit={handleSearchSubmit}>
                  <Box display="flex" alignItems="center" height="100%">
                    <Box flexGrow={1} mr={1}>
                      <TextField
                        id="search"
                        name="search"
                        label="Search"
                        value={searchValue}
                        onChange={handleSearchChange}
                        fullWidth
                        margin="normal"
                        error={isSearchEmpty}
                        helperText={isSearchEmpty ? 'No results found' : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <IconButton type="submit" sx={{ width: 48, height: 48, alignSelf: 'center', backgroundColor: 'primary.main', marginTop: "5px" }}>
                      <SearchIcon sx={{ color: '#fff' }} />
                    </IconButton>
                  </Box>

                </form>
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


                <Modal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  aria-labelledby="search-results-modal-title"
                  aria-describedby="search-results-modal-description"
                >
                  <Box sx={{ width: 400, height: 400, backgroundColor: '#fff', p: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'auto' }}>
                    <Typography id="search-results-modal-title" variant="h6" component="h2">
                      Search Results
                    </Typography>
                    <List>
                      {searchResults.map((result, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                          <a href={`https://pfaf.org/user/${result.link}`} target="_blank" rel="noopener noreferrer">
                            <ListItem button>
                              <ListItemText primary={result['Common Name']} secondary={result['Latin Name']} />
                            </ListItem>
                          </a>
                          <IconButton
                            onClick={() => handleSelectPlant(result)}
                            style={{ marginLeft: 'auto' }}
                          >
                            <AutoFixHigh />
                          </IconButton>
                        </div>
                      ))}
                    </List>
                  </Box>
                </Modal>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </main >
    </Box >
  );
}

export default NewPlant;