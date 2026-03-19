# Auto-Dialer 📞

An automated system to register clock in and clock out times (attendance) in Buk Register using scheduled cron tasks.

## Features

- ✅ Automatic clock in/out marking according to configurable schedules
- 🔄 Sequential endpoint execution (not parallel)
- 📊 Logging system with levels (info, success, warning, error)
- ⏰ Support for multiple schedules per day using cron expressions
- 🔐 Centralized configuration with environment variables

## Installation

Requires Bun as runtime. To install dependencies:

```bash
bun install
```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# User's ID/DNI without dots or hyphens
DNI_NUMBER=99999999

# API base URL (optional, defaults to the value shown)
BASE_DIAL_URL=https://app.ctrlit.cl/ctrl/dial/

# Clock in schedules (cron format, comma-separated)
# SCHEDULE_ENTRY: Example 08:00 and 14:00
SCHEDULE_ENTRY=0 8 * * 1-5,0 14 * * 1-5

# Clock out schedules (cron format, comma-separated)
# SCHEDULE_EXIT: Example 13:00 and 18:00
SCHEDULE_EXIT=0 13 * * 1-5,0 18 * * 1-5
```

### Cron Expression Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7) (0 and 7 are Sunday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Examples:**
- `0 8 * * 1-5` → Every day at 08:00 (Monday to Friday)
- `0 13 * * *` → Every day at 13:00 (including weekends)
- `0 14 * * 0` → Every Sunday at 14:00

## Usage

### Development mode (with auto-restart)

```bash
bun run dev
```

### Production mode

```bash
bun run start
```

### Manual Testing

Uncomment the lines at the end of `src/index.js` file:

```javascript
// executeDialSequence(Object.values(CONFIG.dialUrlsEntry));
// executeDialSequence(Object.values(CONFIG.dialUrlsExit));
```

## Project Structure

```
src/
├── index.js          # Main cron jobs logic
├── config/
│   └── index.js      # Centralized configuration
└── helpers/
    ├── index.js      # Helpers exporter
    └── logger.js     # Logging system
```

## Dial Endpoints

The system executes two endpoints **sequentially** for each clock mark:

1. **REGISTRATION**: Registers the clock mark in the system
2. **WORK_INFO**: Queries additional workday information

Each endpoint receives parameters such as:
- `sentido`: 1 (clock in) or 0 (clock out)
- `rut`: User ID/DNI
- `latitud` / `longitud`: coordinates (optional)

## Logging

The system provides logs with timestamp and levels:

```
[2024-03-18T10:30:00.123Z] ✅ Clock mark completed successfully
[2024-03-18T10:30:05.456Z] ❌ Error in request to https://...
```

**Log Levels:**
- 🔵 `info` - General information
- ✅ `success` - Successful operation
- ⚠️ `warning` - Warning
- ❌ `error` - Error

## Troubleshooting

### Calls are being made in parallel
The project is configured to be **sequential**. Each endpoint executes after the previous one completes.

### Environment variables are not loading
- Verify that the `.env` file exists in the project root
- Make sure Bun is reading correctly with `Bun.env`

### API returns errors
- Verify that `DNI_NUMBER` is valid
- Check that `BASE_DIAL_URL` is accessible
- Review logs for error details

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
