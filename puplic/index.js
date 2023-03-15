const locationBtn = document.getElementById('location-btn');

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { longitude, latitude } = position.coords;
      const location = [longitude, latitude];

      fetch('http://localhost:8080/api/v1/Equipments/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save location data');
        }
        console.log('Location data saved successfully');
      })
      .catch(error => console.log('err',error));
    });
  } else {
    console.error('Geolocation is not supported by this browser');
  }
});
