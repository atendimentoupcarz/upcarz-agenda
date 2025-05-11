# Upcarz Scheduler

A responsive and modern scheduling interface for Upcarz, allowing users to check available time slots for car washing services in Jundiaí condominiums.

## Features

- Condominium selection with dynamic dropdown
- Weekly calendar view with available time slots
- Responsive design that works on mobile and desktop
- Visual indicators for available and unavailable time slots
- Local JSON data storage (can be replaced with API calls)

## Project Structure

```
upcarz-scheduler/
├── data/                     # JSON data files for each condominium
│   ├── Jundiai_BrisasdaMata.json
│   ├── Jundiai_BrisasJundiai.json
│   └── ... (other condominium files)
├── src/
│   ├── config.js            # Configuration and constants
│   ├── utils.js             # Utility functions
│   ├── agenda.js            # Agenda management and rendering
│   └── main.js              # Main application logic
├── index.html               # Main HTML file
├── .gitignore               # Git ignore file
└── README.md                # This file
```

## Setup and Installation

1. Clone this repository or download the files to your local machine.
2. For local development, serve the files using a local web server:
   - Install Python if you don't have it
   - Open a terminal in the project directory
   - Run: `python -m http.server 8000`
   - Open `http://localhost:8000` in your browser

## How to Use

1. Select your condominium from the dropdown menu.
2. View the available time slots in the weekly calendar.
3. Click on an available time slot to select it.

## Data Structure

The application expects data in the following format:

```json
{
    "condominio": "Condominium Name",
    "cidade": "Jundiaí",
    "microRegiao": 1,
    "horariosDisponiveis": {
        "segunda": {
            "manha": ["08:00", "08:30", ...],
            "tarde": ["12:00", "12:30", ...]
        },
        "terca": {
            "manha": ["08:00", "08:30", ...],
            "tarde": ["12:00", "12:30", ...]
        },
        ...
    }
}

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
