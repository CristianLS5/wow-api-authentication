# Battle.net OAuth2 Demo

A demonstration project showing how to implement Battle.net OAuth2 authentication with cookie consent management.

![wow-api-authentication-2](https://github.com/user-attachments/assets/8f027cba-aba3-442e-a415-e7d64d548bab)
![wow-api-authentication-3](https://github.com/user-attachments/assets/b1d1b6be-ad5d-4cc0-8248-870751ebaaa7)
![wow-api-authentication-1](https://github.com/user-attachments/assets/25ac0365-1a93-4ff3-8bba-f3b235b7046e)

## Features

- Battle.net OAuth2 Authentication
- Protected Routes
- Cookie Consent Management
- WoW Character Profile Fetching
- Session Management

## Prerequisites

Before you begin, ensure you have:
- [Node.js](https://nodejs.org/en)
- A [Battle.net Developer Account](https://develop.battle.net)
- Battle.net API credentials (Client ID and Secret)

## Installation

1. Clone the repository: 

```bash
git clone https://github.com/CristianLS5/wow-api-authentication.git
```

2. Install dependencies for both server and demo app:

```bash
# Install server dependencies
cd bnet-auth-server
npm install

# Install demo app dependencies
cd ../bnet-auth-demo
npm install
```

3. Create a `.env` file in the `bnet-auth-server` directory:

```env
BNET_CLIENT_ID=your_client_id
BNET_CLIENT_SECRET=your_client_secret
BNET_REDIRECT_URI=http://localhost:3000/auth/callback
FRONTEND_URL=http://localhost:4200
BNET_REGION=your_region
SESSION_SECRET=your_session_secret
```

## Usage

1. Start the authentication server:
    cd bnet-auth-server
    npm run dev

2. Start the demo application:
    cd bnet-auth-demo
    npx serve -l 4200

3. Visit `http://localhost:4200` in your browser

## Project Structure

    bnet-auth-demo/
    ├── styles/
    │ ├── common.css
    │ ├── cookie-test.css
    │ ├── login.css
    │ └── redirect.css
    ├── js/
    │ └── cookie-config.js
    ├── index.html
    ├── redirect-test.html
    ├── cookie-test.html
    └── package.json
    bnet-auth-server/
    ├── src/
    │ └── server.js
    └── package.json

## Features in Detail

### Battle.net Authentication
- OAuth2 implementation with Battle.net
- Session-based authentication
- Protected routes

### Cookie Management
- Cookie consent banner
- Configurable cookie preferences
- Cookie status monitoring
- Persistent cookie settings

### Character Profile
- WoW character profile fetching
- Protected API endpoints
- Error handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Battle.net API Documentation](https://develop.battle.net/documentation)
- [Vanilla Cookie Consent](https://cookieconsent.orestbida.com/)

