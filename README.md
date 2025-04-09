
# Synchronous WebSockets

This project is an application based on WebSocket that includes a simple client and a server. Client allows to handle server messages and validate their timings to align with the defined Protocol. In case if the message is falling out of the timeout interval it gracefully closes the connection.

## Overview

- The **server** sends messages over a WebSocket connection.
- The **client**:
  - Listens for incoming messages.
  - Validates the timing of each message according to a predefined protocol.
  - Gracefully closes the connection if a message is received outside the allowed time interval.

## Features

- Simple WebSocket client-server architecture
- Timeout validation logic based on protocol rules
- Graceful handling of protocol violations

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Run Server

```bash
npm run start:dev
```

### Run Client

To run the client just open the `/client/index.html` in your browser

## **Technologies Used**

- **Node.js** (for building the server)
- **TypeScript** (for static typing)
- **WebSocket** (for client-server messaging)

## **License**

This project is licensed under the MIT License.
