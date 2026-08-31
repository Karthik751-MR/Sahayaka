# Sahayaka 🤝

> **Technology that helps people reach help faster.**

Sahayaka is a cross-platform React Native/Expo application exploring community assistance and emergency-support workflows. Firebase provides authentication and cloud data capabilities for the mobile experience.

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

</div>

## 🎯 The Mission

In an emergency or support situation, friction matters. Sahayaka explores a mobile-first experience for connecting people who need assistance with community support workflows.

## ✨ Core Features

- 🆘 One-touch assistance workflow
- 🤝 Community/volunteer support flows
- 🔐 Firebase authentication
- ☁️ Firestore-backed application data
- 📱 Cross-platform Expo experience
- 🧩 Reusable mobile components

## 🏗️ Conceptual Flow

```text
User
 ↓
Mobile Application
 ↓
Authentication / Request Flow
 ↓
Firebase Services
 ↓
Support / Community Workflow
 ↓
Assistance Status
```

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Mobile | React Native |
| Framework | Expo |
| Language | TypeScript |
| Authentication | Firebase Authentication |
| Data | Firebase Firestore |
| Navigation | Expo Router |

## 📁 Project Structure

```text
Sahayaka/
└── sahayaka-inter/
    ├── app/              # Expo Router routes/screens
    ├── components/       # Reusable mobile UI
    ├── assets/           # Images and application assets
    ├── package.json
    └── ...
```

## 🚀 Getting Started

```bash
git clone https://github.com/Karthik751-MR/Sahayaka.git
cd Sahayaka/sahayaka-inter
npm install
npx expo start
```

Use Expo Go, an Android emulator, or an iOS simulator.

## 🔐 Firebase Configuration

Configure Firebase using the mechanism expected by the project. Keep private credentials and production configuration out of Git.

For an emergency-support product, also consider authorization, abuse prevention, rate limiting, privacy, and auditability before production deployment.

## 🧪 Test Scenarios

- Authentication success/failure
- Assistance request creation
- Duplicate request prevention
- Offline/intermittent connectivity
- Firebase errors
- Permission denial
- Invalid user state
- Navigation recovery after app restart

## 🗺️ Roadmap

- [ ] Real-time assistance status
- [ ] Push notifications
- [ ] Volunteer matching
- [ ] Location-aware support
- [ ] Request history
- [ ] Stronger offline handling

## 👤 Author

**Karthik Raj M R** — [@Karthik751-MR](https://github.com/Karthik751-MR)