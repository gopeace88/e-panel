# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

**항상 한국어로 응답할 것.**

## Project Overview

스마트 분전반 (Smart Distribution Panel/Switchboard) monitoring and management system.

## Tech Stack

### Frontend
- Vue.js 3 with Vite bundler
- Node.js 16.20, npm
- Vuetify UI framework
- Axios for REST API communication

### Backend
- Java 11/17
- Spring Boot 2.6.3
- MyBatis for database access
- Maven 3.6.3 for build

## Build Commands

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend
```bash
mvn clean install    # Build project
mvn spring-boot:run  # Run development server
mvn test             # Run tests
mvn test -Dtest=TestClassName#methodName  # Run single test
```

## Documentation

Project documentation is located in the `Docs/` directory.
