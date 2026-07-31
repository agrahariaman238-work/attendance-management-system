# Attendance Management System

A full-stack attendance platform built for NSS Society, used by 400+ students. Handles authentication, attendance tracking, and automated reporting, deployed on AWS using a containerized microservice setup.

## Why I built this

Before this, NSS Society tracked attendance on paper and someone manually compiled it into a report every week. I built this to replace that process — and used it as a chance to actually deploy a full production setup (Docker, AWS ECS, Redis) instead of just running something locally.

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

A real CI/CD pipeline — deployments to ECS are still a manual push-and-pray; I'd wire up GitHub Actions to build, test, and deploy automatically.

Better attendance analytics — right now it tracks presence/absence; I'd like to add trends over time so the society can actually spot patterns, not just pull a raw report.
