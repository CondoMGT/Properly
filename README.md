# Properly: Condo Management Application

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

Condo Connect is a comprehensive web application designed to streamline communication and management processes between condo tenants and property managers. This platform offers an intuitive interface for both tenants and property managers, facilitating efficient handling of requests, payments, and property-related communications.

## Features

### For Tenants / Homeowners:

- User-friendly dashboard for managing personal information
- Submit and track maintenance requests
- View and pay rent online
- Access important documents and announcements
- Communicate directly with property management

### For Property Managers:

- Centralized dashboard for overseeing multiple properties
- Efficiently manage and respond to tenant requests
- Track rent payments and generate financial reports
- Post announcements and important documents
- Manage property maintenance schedules

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/CondoMGT/Condo-Tenant-Management.git <folder_name>
   ```

2. Navigate to the project directory:

   ```
   cd <folder_name>
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up environment variables:

   - Copy the `.env.example` file to `.env.local`
   - Fill in the required environment variables

5. Run the development server:

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

After installation, you can:

1. Register as a new user (tenant or property manager)
2. Log in to your account
3. Navigate through the dashboard to access various features
4. Submit requests, make payments, or manage properties based on your role

## Technology Stack

- **Frontend**: React.js with Next.js framework
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Node.js with Express.js (API routes in Next.js)
- **Database**: PostgreSQL (with Prisma ORM)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Project Structure

```
condo-mgt/
│
├── app/
│   ├── api/
│   ├── (auth)/
│   ├── dashboard/
|   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── forms/
│
├── lib/
│   ├── prisma.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
│
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

We welcome contributions to Condo Connect! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Properly - [@properly](https://twitter.com/properly) - condotenantmanagement@gmail.com

Project Link: [https://github.com/CondoMGT/Condo-Tenant-Management](https://github.com/CondoMGT/Condo-Tenant-Management)
