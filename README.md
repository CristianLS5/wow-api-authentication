<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

# Battle.net OAuth2 Demo

A demonstration project showing how to implement Battle.net OAuth2 authentication with cookie consent management.

+ <div align="center">
+   <img src="https://github.com/user-attachments/assets/8f027cba-aba3-442e-a415-e7d64d548bab" width="400" alt="Login Page">
+   <img src="https://github.com/user-attachments/assets/b1d1b6be-ad5d-4cc0-8248-870751ebaaa7" width="400" alt="Cookie Consent">
+   <img src="https://github.com/user-attachments/assets/25ac0365-1a93-4ff3-8bba-f3b235b7046e" width="400" alt="Character Profile">
+ </div>

## Table of Contents
1. [Built With](#built-with)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Features in Detail](#features-in-detail)
8. [License](#license)
9. [Contact](#contact)
10. [Acknowledgments](#acknowledgments)

### Built With

* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

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
- [Battle.net API credentials](https://develop.battle.net/documentation/guides/getting-started) (Client ID and Secret)

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

## Contact

Cristian López Segarra - [@LinkedIn](https://www.linkedin.com/in/cristian-lopez-segarra/) - [Portfolio](your-portfolio-url)

Project Link: [https://github.com/CristianLS5/wow-api-authentication](https://github.com/CristianLS5/wow-api-authentication)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Battle.net API Documentation](https://develop.battle.net/documentation)
- [Vanilla Cookie Consent](https://cookieconsent.orestbida.com/)

## Third-Party Libraries

This project uses the following third-party libraries:

- [vanilla-cookieconsent](https://github.com/orestbida/cookieconsent) - A lightweight yet powerful solution for cookie consent management
  - Version: 3.0.1
  - License: MIT
  - Documentation: [Getting Started Guide](https://cookieconsent.orestbida.com/essential/getting-started.html)

[contributors-shield]: https://img.shields.io/github/contributors/CristianLS5/wow-api-authentication.svg?style=for-the-badge
[contributors-url]: https://github.com/CristianLS5/wow-api-authentication/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/CristianLS5/wow-api-authentication.svg?style=for-the-badge
[forks-url]: https://github.com/CristianLS5/wow-api-authentication/network/members
[stars-shield]: https://img.shields.io/github/stars/CristianLS5/wow-api-authentication.svg?style=for-the-badge
[stars-url]: https://github.com/CristianLS5/wow-api-authentication/stargazers
[issues-shield]: https://img.shields.io/github/issues/CristianLS5/wow-api-authentication.svg?style=for-the-badge
[issues-url]: https://github.com/CristianLS5/wow-api-authentication/issues
[license-shield]: https://img.shields.io/github/license/CristianLS5/wow-api-authentication.svg?style=for-the-badge
[license-url]: https://github.com/CristianLS5/wow-api-authentication/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/cristian-lopez-segarra/
