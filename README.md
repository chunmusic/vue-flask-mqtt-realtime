# web-service-tools

The purpose of this project is to provide the web monitoring UI. They can easily access to this web application to monitor status of devices, etc. To use this web application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

### Prerequisites

* NodeJS 16 or later
* VueJS 3
* Python 3.10 or later
* Docker
* docker-compose

### Installation

To run the install and compile the source code for application development, please refer to the following commands below.

##### Builing Frontend
```
cd frontend
npm ci
```

##### Building Backend
```
cd backend
pipenv sync --dev
pipenv shell
```

##### Run locally
```
cd ..
make local-build
make local-up
```
