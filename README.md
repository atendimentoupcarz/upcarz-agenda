# Upcarz Scheduler

A responsive and modern scheduling interface for Upcarz, allowing users to check available time slots for car washing services.

## Features

- City and condominium selection with dynamic dropdowns
- Weekly calendar view with available time slots
- Responsive design that works on mobile and desktop
- Visual indicators for available and unavailable time slots
- Easy integration with Google Sheets API (simulated with JSON files in this demo)

## Project Structure

```
upcarz-scheduler/
├── data/                    # Sample JSON data files (simulating Google Sheets)
│   └── Campinas_JardimdosLagos.json
├── src/
│   ├── config.js           # Configuration and constants
│   ├── utils.js            # Utility functions
│   ├── agenda.js           # Agenda management and rendering
│   └── main.js             # Main application logic
├── index.html              # Main HTML file
└── README.md               # This file
```

## Setup and Installation

1. Clone this repository or download the files to your local machine.
2. Open `index.html` in a modern web browser to view the application.

## How to Use

1. Select your city from the dropdown menu.
2. Choose your condominium from the second dropdown.
3. View the available time slots in the weekly calendar.
4. Click on an available time slot to select it.

## Data Structure

The application expects data in the following format (matching Google Sheets structure):

```json
{
    "location": {
        "city": "City Name",
        "condominium": "Condominium Name"
    },
    "availability": {
        "YYYY-MM-DD": [
            { "time": "8-10", "available": true },
            { "time": "10-12", "available": false },
            // ... more time slots
        ]
        // ... more dates
    }
}
```

## Integration with Google Sheets (Future Implementation)

To connect with Google Sheets in production:

1. Set up a Google Cloud Project and enable the Google Sheets API.
2. Create a service account and download the credentials JSON file.
3. Update the `CONFIG` object in `src/config.js` with your Google Sheets ID and API key.
4. Uncomment and implement the Google Sheets API calls in the `loadAgenda` method.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Credits

Built for Upcarz by [Your Name]
