# FitTrack Pro - AI-Powered Fitness Tracking Platform

A microservices-based fitness tracking application with AI-powered recommendations. Users can log workouts, track progress, and receive personalized fitness insights powered by Google Gemini AI.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Microservices Overview](#microservices-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Event-Driven Architecture](#event-driven-architecture)
- [AI Recommendations](#ai-recommendations)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

FitTrack Pro is a cloud-native fitness tracking platform built using microservices architecture. The application allows users to:
- Log fitness activities (running, cycling, swimming, gym workouts)
- Track calories burned, duration, distance, and other metrics
- Receive AI-powered recommendations for improving performance
- View personalized suggestions for next workouts
- Access safety guidelines based on activity data

The system uses **event-driven architecture** with RabbitMQ for asynchronous AI processing and **Google Gemini AI** for generating intelligent fitness recommendations.

## Features

### Core Features
- **Activity Tracking**: Log various types of fitness activities with detailed metrics
- **AI-Powered Recommendations**: Get personalized insights using Google Gemini AI
- **Real-time Processing**: Asynchronous AI analysis using RabbitMQ
- **Secure Authentication**: OAuth2 with Keycloak integration
- **Microservices Architecture**: Scalable, maintainable, and independently deployable services
- **Service Discovery**: Dynamic service registration and discovery with Eureka
- **Centralized Configuration**: Config Server for managing all service configurations
- **API Gateway**: Single entry point with routing and authentication

### User Features
- OAuth2 authentication via Keycloak
- Create and track multiple activity types
- View activity history with timestamps
- Get AI-generated performance analysis
- Receive improvement suggestions
- Access next workout recommendations
- View safety guidelines

### Technical Features
- Event-driven architecture (RabbitMQ)
- Service discovery (Netflix Eureka)
- Centralized configuration (Spring Cloud Config)
- API Gateway pattern (Spring Cloud Gateway)
- Polyglot persistence (PostgreSQL + MongoDB)
- OAuth2 Resource Server
- Reactive programming (Spring WebFlux)

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│                    React Frontend (Port 5173)                        │
│              Material-UI, Redux, React Router, OAuth2                │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (Port 8080)                        │
│           Spring Cloud Gateway + OAuth2 Resource Server              │
│                   User Sync Filter (Keycloak)                        │
└──────┬──────────────────┬──────────────────┬───────────────────────┘
       │                  │                  │
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│USER SERVICE │   │   ACTIVITY   │   │ AI SERVICE  │
│  (8081)     │   │   SERVICE    │   │   (8083)    │
│             │   │    (8082)    │   │             │
│ PostgreSQL  │   │   MongoDB    │   │   MongoDB   │
│             │   │   RabbitMQ   │   │   RabbitMQ  │
│             │   │  (Publisher) │   │  (Consumer) │
└─────────────┘   └──────┬───────┘   └──────┬──────┘
                         │                  │
                         │   RabbitMQ       │
                         │   Exchange       │
                         └─────────┬────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │  activity.queue │
                         │  fitness.exchng │
                         │  routing:       │
                         │ activity.track  │
                         └─────────────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │   Google Gemini │
                         │   AI Service    │
                         └─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                            │
├──────────────────────────┬──────────────────────────────────────────┤
│   CONFIG SERVER (8888)   │      EUREKA SERVER (8761)                │
│   Centralized Config     │      Service Discovery                   │
│   Native File System     │      Service Registry                    │
└──────────────────────────┴──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                              │
│   Keycloak (8181) │ RabbitMQ (5672) │ PostgreSQL │ MongoDB          │
└─────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Backend - Microservices
- **Framework**: Spring Boot 3.4.4
- **Java Version**: 21
- **Cloud**: Spring Cloud 2024.0.1
- **Authentication**: OAuth2 Resource Server + Keycloak
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Configuration**: Spring Cloud Config Server
- **Databases**: 
  - PostgreSQL (User Service)
  - MongoDB (Activity & AI Services)
- **Messaging**: RabbitMQ (AMQP)
- **AI Integration**: Google Gemini API
- **HTTP Client**: Spring WebFlux (WebClient)
- **Build Tool**: Maven
- **Utilities**: Lombok, Jackson

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.2.0
- **UI Library**: Material-UI (MUI) 7.0.2
- **State Management**: Redux Toolkit 2.6.1
- **Routing**: React Router 7.5.0
- **Authentication**: react-oauth2-code-pkce 1.23.0
- **Styling**: TailwindCSS 4.1.4, Styled Components 6.1.17
- **HTTP Client**: Axios 1.8.4
- **Icons**: Material-UI Icons, Lucide React
- **Notifications**: Sonner 2.0.3
- **Validation**: Zod 3.24.2

### External Services
- **Keycloak**: OAuth2 Authorization Server
- **Google Gemini**: AI-powered fitness recommendations
- **RabbitMQ**: Message broker for event-driven architecture

## Microservices Overview

### 1. Config Server (Port 8888)
**Purpose**: Centralized configuration management for all microservices

**Technology**: Spring Cloud Config Server
- Native file system configuration
- Stores all service configurations in classpath:/config
- Configurations for: Gateway, User Service, Activity Service, AI Service

**Key Features**:
- Centralized configuration management
- Environment-specific configurations
- Dynamic configuration updates

### 2. Eureka Server (Port 8761)
**Purpose**: Service discovery and registry

**Technology**: Netflix Eureka Server
- All microservices register themselves with Eureka
- Load balancing and service-to-service communication
- Health monitoring

**Key Features**:
- Dynamic service registration
- Service health checks
- Client-side load balancing

### 3. Gateway Service (Port 8080)
**Purpose**: API Gateway - Single entry point for all client requests

**Technology**: Spring Cloud Gateway + OAuth2
- Routes requests to appropriate microservices
- OAuth2 Resource Server for JWT validation
- Keycloak integration for user authentication
- CORS configuration

**Routes**:
- `/api/users/**` → User Service
- `/api/activities/**` → Activity Service
- `/api/recommendations/**` → AI Service

**Key Features**:
- JWT token validation
- User synchronization with Keycloak
- Request routing and load balancing
- CORS and security configuration
- X-User-Id header injection

### 4. User Service (Port 8081)
**Purpose**: User management and authentication

**Technology**: Spring Boot + PostgreSQL + JPA
- User registration and profile management
- Keycloak ID synchronization
- User validation for other services

**Database**: PostgreSQL (`fitness` database)

**Key Features**:
- User CRUD operations
- Keycloak integration
- User validation API for other services
- UUID-based user IDs

### 5. Activity Service (Port 8082)
**Purpose**: Fitness activity tracking and management

**Technology**: Spring Boot + MongoDB + RabbitMQ
- Track various activity types (Running, Cycling, Swimming, Gym, Yoga, etc.)
- Store activity metrics (duration, calories, distance, heart rate)
- Publish activity events to RabbitMQ for AI processing

**Database**: MongoDB (`fitness` database, `activities` collection)

**Key Features**:
- Activity CRUD operations
- User validation before activity creation
- RabbitMQ event publishing
- Custom metrics support
- Timestamp tracking

### 6. AI Service (Port 8083)
**Purpose**: AI-powered fitness recommendations using Google Gemini

**Technology**: Spring Boot + MongoDB + RabbitMQ + Google Gemini API
- Consumes activity events from RabbitMQ
- Generates personalized recommendations using AI
- Stores recommendations in MongoDB

**Database**: MongoDB (`fitness` database, `recommendations` collection)

**Key Features**:
- RabbitMQ message consumer
- Google Gemini AI integration
- Structured AI prompt engineering
- JSON response parsing
- Performance analysis
- Improvement suggestions
- Next workout recommendations
- Safety guidelines

### 7. Frontend (Port 5173)
**Purpose**: User interface for fitness tracking

**Technology**: React + Material-UI + Vite
- Modern, responsive UI
- OAuth2 authentication
- Activity management
- Real-time updates

**Key Features**:
- OAuth2 PKCE flow with Keycloak
- Activity form with validation
- Activity list with filtering
- Detailed activity view with AI recommendations
- User profile management

## Project Structure

```
fitness/
├── fitness-microservice/
│   ├── configserver/              # Spring Cloud Config Server
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/akhil/configserver/
│   │   │       │   └── ConfigServerApplication.java
│   │   │       └── resources/
│   │   │           ├── application.yaml
│   │   │           └── config/              # Service configurations
│   │   │               ├── gateway-service.yaml
│   │   │               ├── user-service.yaml
│   │   │               ├── activity-service.yaml
│   │   │               └── ai-service.yaml
│   │   └── pom.xml
│   │
│   ├── eureka-server/             # Netflix Eureka Server
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/akhil/eureka_server/
│   │   │       │   └── EurekaServerApplication.java
│   │   │       └── resources/
│   │   │           └── application.yaml
│   │   └── pom.xml
│   │
│   ├── gateway/                   # API Gateway
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/akhil/gateway/
│   │   │       │   ├── config/
│   │   │       │   │   └── SecurityConfig.java
│   │   │       │   ├── user/
│   │   │       │   │   ├── KeyCloakUserSyncFilter.java
│   │   │       │   │   ├── UserService.java
│   │   │       │   │   ├── UserResponse.java
│   │   │       │   │   ├── RegisterRequest.java
│   │   │       │   │   └── WebConfig.java
│   │   │       │   └── GatewayApplication.java
│   │   │       └── resources/
│   │   │           └── application.yaml
│   │   └── pom.xml
│   │
│   ├── userservice/               # User Management Service
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/fitness/userservice/
│   │   │       │   ├── controller/
│   │   │       │   │   └── UserController.java
│   │   │       │   ├── dto/
│   │   │       │   │   ├── RegisterRequest.java
│   │   │       │   │   └── UserResponse.java
│   │   │       │   ├── model/
│   │   │       │   │   ├── User.java
│   │   │       │   │   └── UserRole.java
│   │   │       │   ├── repo/
│   │   │       │   │   └── UserRepo.java
│   │   │       │   ├── service/
│   │   │       │   │   ├── UserService.java
│   │   │       │   │   └── impl/
│   │   │       │   │       └── UserServiceImpl.java
│   │   │       │   └── UserServiceApplication.java
│   │   │       └── resources/
│   │   │           └── application.yaml
│   │   └── pom.xml
│   │
│   ├── activityservice/           # Activity Tracking Service
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/fitness/activityservice/
│   │   │       │   ├── controller/
│   │   │       │   │   └── ActivityController.java
│   │   │       │   ├── dto/
│   │   │       │   │   ├── ActivityRequest.java
│   │   │       │   │   └── ActivityResponse.java
│   │   │       │   ├── model/
│   │   │       │   │   ├── Activity.java
│   │   │       │   │   └── ActivityType.java
│   │   │       │   ├── repo/
│   │   │       │   │   └── ActivityRepo.java
│   │   │       │   ├── service/
│   │   │       │   │   ├── ActivityService.java
│   │   │       │   │   └── impl/
│   │   │       │   │       ├── ActivityServiceImpl.java
│   │   │       │   │       └── UserValidationServiceImpl.java
│   │   │       │   └── ActivityServiceApplication.java
│   │   │       └── resources/
│   │   │           └── application.yaml
│   │   └── pom.xml
│   │
│   └── aiservice/                 # AI Recommendation Service
│       ├── src/
│       │   └── main/
│       │       ├── java/com/akhil/aiservice/
│       │       │   ├── config/
│       │       │   │   ├── RabbitMqConfig.java
│       │       │   │   └── WebConfig.java
│       │       │   ├── controller/
│       │       │   │   └── RecommendationController.java
│       │       │   ├── dto/
│       │       │   │   └── Activity.java
│       │       │   ├── model/
│       │       │   │   └── Recommendation.java
│       │       │   ├── repo/
│       │       │   │   └── RecommendationRepo.java
│       │       │   ├── service/
│       │       │   │   ├── ActivityAIService.java
│       │       │   │   ├── GeminiService.java
│       │       │   │   ├── RecommendationService.java
│       │       │   │   └── impl/
│       │       │   │       ├── ActivityAiServiceImpl.java
│       │       │   │       ├── ActivityMessageListener.java
│       │       │   │       ├── GeminiServiceImpl.java
│       │       │   │       └── RecommendationServiceImpl.java
│       │       │   └── AiServiceApplication.java
│       │       └── resources/
│       │           └── application.yaml
│       └── pom.xml
│
└── fitness-frontend/              # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── ActivityForm.jsx
    │   │   ├── ActivityList.jsx
    │   │   └── ActivityDetail.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   └── authSlice.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Prerequisites

### Backend Requirements
- **Java**: 21 or higher
- **Maven**: 3.8+
- **PostgreSQL**: 14+ (User Service)
- **MongoDB**: 5.0+ (Activity & AI Services)
- **RabbitMQ**: 3.11+ (Message broker)
- **Keycloak**: 23+ (Authentication server)
- **Google Gemini API**: API key from Google AI Studio

### Frontend Requirements
- **Node.js**: 18+
- **npm** or **yarn**

### Infrastructure Requirements
- Docker (optional, for running databases and RabbitMQ)
- Keycloak server instance

## Installation

### 1. Infrastructure Setup

#### Using Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: fitness
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: Eshwar@351
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  rabbitmq:
    image: rabbitmq:3.11-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    command: start-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8181:8080"

volumes:
  postgres_data:
  mongo_data:
```

Start services:
```bash
docker-compose up -d
```

### 2. Keycloak Configuration

1. **Access Keycloak Admin Console**
   - URL: http://localhost:8181
   - Username: admin
   - Password: admin

2. **Create Realm**
   - Create new realm named `fitness`

3. **Create Client**
   - Client ID: `fitness-client`
   - Access Type: public
   - Valid Redirect URIs: `http://localhost:5173/*`
   - Web Origins: `http://localhost:5173`

4. **Get Configuration**
   - JWKS URL: `http://localhost:8181/realms/fitness/protocol/openid-connect/certs`
   - Token Endpoint: `http://localhost:8181/realms/fitness/protocol/openid-connect/token`
   - Authorization Endpoint: `http://localhost:8181/realms/fitness/protocol/openid-connect/auth`

### 3. Google Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Copy the API key for configuration

### 4. Clone Repository

```bash
git clone <repository-url>
cd fitness
```

### 5. Backend Configuration

Update configuration files in `configserver/src/main/resources/config/`:

**gateway-service.yaml**:
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: http://localhost:8181/realms/fitness/protocol/openid-connect/certs
```

**user-service.yaml**:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fitness
    username: postgres
    password: your_password
```

**activity-service.yaml**:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/fitness
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
```

**ai-service.yaml**:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/fitness
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

gemini:
  api:
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=
    key: your_gemini_api_key
```

### 6. Build All Services

```bash
cd fitness-microservice

# Build all services
mvn clean install -DskipTests

# Or build individually
cd configserver && mvn clean install && cd ..
cd eureka-server && mvn clean install && cd ..
cd gateway && mvn clean install && cd ..
cd userservice && mvn clean install && cd ..
cd activityservice && mvn clean install && cd ..
cd aiservice && mvn clean install && cd ..
```

### 7. Frontend Setup

```bash
cd fitness-frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8181
VITE_KEYCLOAK_REALM=fitness
VITE_KEYCLOAK_CLIENT_ID=fitness-client
```

## Running the Application

### Start Services in Order

**1. Infrastructure Services** (if not using Docker):
```bash
# PostgreSQL, MongoDB, RabbitMQ, Keycloak should be running
```

**2. Config Server** (Port 8888):
```bash
cd fitness-microservice/configserver
mvn spring-boot:run
```
Wait for: `Config Server running on port 8888`

**3. Eureka Server** (Port 8761):
```bash
cd fitness-microservice/eureka-server
mvn spring-boot:run
```
Wait for: `Eureka Server started`

**4. Gateway Service** (Port 8080):
```bash
cd fitness-microservice/gateway
mvn spring-boot:run
```
Wait for: `Gateway registered with Eureka`

**5. User Service** (Port 8081):
```bash
cd fitness-microservice/userservice
mvn spring-boot:run
```

**6. Activity Service** (Port 8082):
```bash
cd fitness-microservice/activityservice
mvn spring-boot:run
```

**7. AI Service** (Port 8083):
```bash
cd fitness-microservice/aiservice
mvn spring-boot:run
```

**8. Frontend** (Port 5173):
```bash
cd fitness-frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Keycloak**: http://localhost:8181

## API Endpoints

### Gateway Routes

All requests go through the API Gateway at `http://localhost:8080`

#### User Service (`/api/users/**`)

```http
POST /api/users/register
GET  /api/users/{userId}
GET  /api/users/validate/{userId}
```

#### Activity Service (`/api/activities/**`)

```http
POST /api/activities
Headers: Authorization: Bearer <token>, X-User-Id: <userId>
Body: {
  "type": "RUNNING",
  "duration": 60,
  "caloriesBurned": 600,
  "startTime": "2025-05-02T10:00:00",
  "additionalMetrics": {
    "distance": 5.2,
    "averageSpeed": 10.4,
    "maxHeartRate": 165
  }
}

GET /api/activities
Headers: Authorization: Bearer <token>, X-User-Id: <userId>

GET /api/activities/{activityId}
Headers: Authorization: Bearer <token>
```

#### AI Service (`/api/recommendations/**`)

```http
GET /api/recommendations/user/{userId}
Headers: Authorization: Bearer <token>

GET /api/recommendations/activity/{activityId}
Headers: Authorization: Bearer <token>
```

### Activity Types

- `RUNNING`
- `CYCLING`
- `SWIMMING`
- `GYM`
- `YOGA`
- `WALKING`
- `HIKING`
- `SPORTS`

## Event-Driven Architecture

### RabbitMQ Configuration

**Exchange**: `fitness.exchange`
**Queue**: `activity.queue`
**Routing Key**: `activity.tracking`

### Message Flow

1. **Activity Creation**:
   - User creates an activity via frontend
   - Activity Service validates user
   - Activity saved to MongoDB
   - Activity published to RabbitMQ

2. **Message Publishing** (Activity Service):
```java
rabbitTemplate.convertAndSend(
    "fitness.exchange",      // Exchange
    "activity.tracking",     // Routing Key
    activity                 // Message
);
```

3. **Message Consumption** (AI Service):
```java
@RabbitListener(queues = "activity.queue")
public void processActivity(Activity activity) {
    Recommendation recommendation = 
        activityAIService.generateRecommendation(activity);
    recommendationRepo.save(recommendation);
}
```

4. **AI Processing**:
   - AI Service receives activity from queue
   - Generates structured prompt for Gemini
   - Calls Google Gemini API
   - Parses JSON response
   - Saves recommendation to MongoDB

5. **Retrieval**:
   - User views activity details
   - Frontend fetches recommendation
   - Displays AI insights

## AI Recommendations

### Gemini AI Integration

The AI Service uses Google Gemini to generate personalized fitness recommendations.

### Prompt Structure

```json
{
  "contents": [{
    "parts": [{
      "text": "Analyze the following fitness activity and provide recommendations..."
    }]
  }]
}
```

### AI Response Format

```json
{
  "analysis": {
    "overall": "Overall performance analysis",
    "pace": "Pace analysis",
    "heartRate": "Heart rate analysis",
    "caloriesBurned": "Calories burned analysis"
  },
  "improvements": [
    {
      "area": "Endurance",
      "recommendation": "Gradually increase duration..."
    }
  ],
  "suggestions": [
    {
      "workout": "Interval Training",
      "description": "Alternate between high and low intensity..."
    }
  ],
  "safety": [
    "Always warm up before exercise",
    "Stay hydrated during workouts"
  ]
}
```

### Recommendation Components

1. **Analysis**: Detailed breakdown of performance metrics
2. **Improvements**: Areas to focus on for better results
3. **Suggestions**: Next workout recommendations
4. **Safety**: Important safety guidelines

## Database Schema

### PostgreSQL (User Service)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    key_cloak_id VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP,
    update_at TIMESTAMP
);
```

### MongoDB Collections

#### Activities Collection
```json
{
  "_id": "ObjectId",
  "userId": "uuid",
  "type": "RUNNING",
  "duration": 60,
  "caloriesBurned": 600,
  "startTime": "ISODate",
  "additionalMetrics": {
    "distance": 5.2,
    "averageSpeed": 10.4,
    "maxHeartRate": 165
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

#### Recommendations Collection
```json
{
  "_id": "ObjectId",
  "activityId": "ObjectId",
  "userId": "uuid",
  "activityType": "RUNNING",
  "recommendation": "Overall: Good performance...",
  "improvements": [
    "Endurance: Gradually increase duration..."
  ],
  "suggestions": [
    "Interval Training: Alternate between..."
  ],
  "safety": [
    "Always warm up before exercise"
  ]
}
```

## Authentication Flow

### OAuth2 PKCE Flow with Keycloak

1. **Login Initiation**:
   - User clicks "Get Started"
   - Frontend generates code_verifier and code_challenge
   - Redirects to Keycloak authorization endpoint

2. **Authorization**:
   - User logs in via Keycloak
   - Keycloak returns authorization code

3. **Token Exchange**:
   - Frontend exchanges code + code_verifier for tokens
   - Receives access_token and refresh_token

4. **API Requests**:
   - Frontend includes `Authorization: Bearer <token>` header
   - Gateway validates JWT using Keycloak JWKS
   - Gateway extracts user ID from JWT claims

5. **User Synchronization**:
   - `KeyCloakUserSyncFilter` runs on every request
   - Extracts user info from JWT
   - Checks if user exists in User Service
   - Registers user automatically if not exists
   - Injects `X-User-Id` header for downstream services

6. **Service Communication**:
   - All services receive `X-User-Id` header
   - Services validate user and process requests

## Configuration

### Service Ports

| Service | Port |
|---------|------|
| Config Server | 8888 |
| Eureka Server | 8761 |
| Gateway | 8080 |
| User Service | 8081 |
| Activity Service | 8082 |
| AI Service | 8083 |
| Frontend | 5173 |
| Keycloak | 8181 |
| PostgreSQL | 5432 |
| MongoDB | 27017 |
| RabbitMQ | 5672 |
| RabbitMQ Management | 15672 |

### Environment Variables

**Backend** (Config Server):
```properties
server.port=8888
spring.profiles.active=native
```

**Frontend**:
```env
VITE_API_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8181
VITE_KEYCLOAK_REALM=fitness
VITE_KEYCLOAK_CLIENT_ID=fitness-client
```

## Deployment

### Production Considerations

1. **Externalize Configuration**:
   - Use Git repository for Config Server
   - Use environment variables for secrets
   - Use Spring Profiles for different environments

2. **Database**:
   - Use managed PostgreSQL (AWS RDS, Azure Database)
   - Use MongoDB Atlas for MongoDB
   - Use CloudAMQP for RabbitMQ

3. **Service Discovery**:
   - Consider Consul or AWS Cloud Map
   - Use DNS-based discovery in Kubernetes

4. **API Gateway**:
   - Add rate limiting
   - Implement circuit breakers
   - Enable request/response logging

5. **Security**:
   - Use HTTPS everywhere
   - Implement API key authentication
   - Add request validation
   - Enable CORS properly

### Docker Deployment

Build Docker images for each service:

```dockerfile
# Example Dockerfile for any service
FROM openjdk:21-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Build and run:
```bash
docker build -t fitness-gateway .
docker run -p 8080:8080 fitness-gateway
```

### Kubernetes Deployment

Create Kubernetes manifests for:
- ConfigMaps (configuration)
- Secrets (credentials)
- Deployments (services)
- Services (networking)
- Ingress (external access)

### Cloud Platforms

**AWS**:
- ECS/EKS for microservices
- RDS for PostgreSQL
- DocumentDB for MongoDB
- Amazon MQ for RabbitMQ
- Cognito (alternative to Keycloak)

**Azure**:
- AKS for microservices
- Azure Database for PostgreSQL
- Cosmos DB for MongoDB
- Azure Service Bus (alternative to RabbitMQ)
- Azure AD B2C (alternative to Keycloak)

**GCP**:
- GKE for microservices
- Cloud SQL for PostgreSQL
- Cloud Firestore for MongoDB
- Cloud Pub/Sub (alternative to RabbitMQ)

## Troubleshooting

### Common Issues

**1. Services not registering with Eureka**
```bash
# Check if Eureka is running
curl http://localhost:8761/eureka/apps

# Verify eureka.client.serviceUrl in application.yaml
# Ensure Config Server is running first
```

**2. Gateway can't route requests**
```bash
# Check Gateway logs for routing configuration
# Verify services are registered with Eureka
# Check Config Server for gateway-service.yaml
```

**3. RabbitMQ connection failed**
```bash
# Verify RabbitMQ is running
docker ps | grep rabbitmq

# Check credentials in configuration
# Verify exchange and queue are created
```

**4. OAuth2 authentication fails**
```bash
# Verify Keycloak is running on port 8181
# Check JWKS URL is accessible
# Verify client configuration in Keycloak
# Check frontend .env file for correct URLs
```

**5. AI recommendations not generating**
```bash
# Check RabbitMQ queue for messages
# Verify Gemini API key is valid
# Check AI Service logs for errors
# Ensure MongoDB is accessible
```

**6. Database connection errors**
```bash
# PostgreSQL: Check if running on port 5432
# MongoDB: Check if running on port 27017
# Verify credentials in configuration
# Check network connectivity
```

### Debug Mode

Enable debug logging:
```yaml
logging:
  level:
    root: DEBUG
    com.fitness: DEBUG
    org.springframework.cloud: DEBUG
```

### Health Checks

Check service health:
```bash
# Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health

# Activity Service
curl http://localhost:8082/actuator/health

# AI Service
curl http://localhost:8083/actuator/health
```

## Testing

### API Testing with cURL

**Create Activity**:
```bash
curl -X POST http://localhost:8080/api/activities \
  -H "Authorization: Bearer <token>" \
  -H "X-User-Id: <userId>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "RUNNING",
    "duration": 60,
    "caloriesBurned": 600,
    "startTime": "2025-05-02T10:00:00",
    "additionalMetrics": {
      "distance": 5.2,
      "averageSpeed": 10.4,
      "maxHeartRate": 165
    }
  }'
```

**Get Activities**:
```bash
curl http://localhost:8080/api/activities \
  -H "Authorization: Bearer <token>" \
  -H "X-User-Id: <userId>"
```

**Get Recommendations**:
```bash
curl http://localhost:8080/api/recommendations/user/<userId> \
  -H "Authorization: Bearer <token>"
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Add workout programs and challenges
- [ ] Implement social features (friends, sharing)
- [ ] Add nutrition tracking
- [ ] Implement progress charts and analytics
- [ ] Add push notifications
- [ ] Implement workout video streaming
- [ ] Add wearable device integration
- [ ] Implement gamification features
- [ ] Add multi-language support
- [ ] Implement dark mode

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Spring Cloud** for microservices framework
- **Netflix Eureka** for service discovery
- **Google Gemini** for AI-powered recommendations
- **Keycloak** for authentication
- **RabbitMQ** for messaging
- **Material-UI** for beautiful UI components

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: akhil.vathaluru@gmail.com

---

**Built with ❤️ by Akhileswar**
