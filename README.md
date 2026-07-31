# Attendance Management System

A full-stack attendance platform built for NSS Society, used by 400+ students. Handles authentication, attendance tracking, and automated reporting, deployed on AWS using a containerized microservice setup.

## Why I built this

[1-2 sentences in your own words: what problem the society had before this existed — e.g. manual attendance tracking, paper registers, delayed reporting — and why you decided to build it. This is the one thing a template can't write for you — fill this in.]

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│   Express   │─────▶│  MongoDB    │
│  (Nginx)    │      │     API     │      │   Atlas     │
└─────────────┘      └──────┬──────┘      └─────────────┘
                             │
                             ▼
                      ┌─────────────┐
                      │    Redis    │
                      │(Rate Limit) │
                      └─────────────┘

Deployed on AWS: ECS Fargate (both containers) behind an
Application Load Balancer, images in Amazon ECR, secrets
via SSM Parameter Store + IAM execution roles, VPC security
groups restricting inbound access.
```

## Features

- JWT-based authentication with role-based access (admin / student)
- Attendance marking and tracking for 400+ registered students
- Redis-backed rate limiting on the API layer to prevent abuse
- Automated Excel export for attendance reports — replaced a manual reporting process
- CORS-restricted API, VPC security groups for network isolation

## Tech stack

**Frontend:** React, Nginx (served via Docker)
**Backend:** Node.js, Express.js
**Database:** MongoDB (Atlas)
**Caching / Rate limiting:** Redis
**Infra:** Docker, Amazon ECR, AWS ECS Fargate, Application Load Balancer, AWS SSM Parameter Store, IAM

## Running locally

```bash
# clone the repo
git clone https://github.com/agrahariaman238-work/attendance-management-system.git
cd attendance-management-system

# backend
cd server
npm install
npm run dev

# frontend (separate terminal)
cd client
npm install
npm start
```

[Adjust the commands above to match your actual folder structure and package.json scripts — replace `server`/`client` if your directories are named differently.]

## Environment variables

Create a `.env` file with:
```
MONGODB_URI=
JWT_SECRET=
REDIS_URL=
```
[List the actual env vars your app needs — this is important, fill in the real ones.]

## What I'd improve next

[2-3 honest, specific things — e.g. "add automated tests," "move to a proper CI/CD pipeline instead of manual ECS deploys," "add monitoring/alerting." This section signals maturity to a technical reviewer far more than claiming everything is perfect.]
