# 📱 Evidential Capture App

> **Secure Evidence Collection for Legal Proceedings**

A professional React Native mobile application designed for government personnel to securely capture, store, and verify digital evidence from social media platforms for legal proceedings.

---

## 🎯 Overview

The Evidential Capture App is a specialized mobile application that enables authorized government officials to:

- **Securely capture screenshots** from social media platforms within the app
- **Store evidence privately** without saving to device gallery
- **Generate cryptographic hashes** (SHA-256 and MD5) for each screenshot
- **Verify authenticity** of screenshots to detect tampering
- **Manage legal cases** with associated evidence
- **Maintain chain of custody** for court admissibility

This application ensures the integrity and authenticity of digital evidence, making it suitable for presentation in court proceedings.

---

## ✨ Key Features

### 🔒 Secure Screenshot Capture
- In-app browser for accessing social media platforms
- Secure screenshot functionality that bypasses device gallery
- Encrypted local storage for all captured evidence

### 🔐 Cryptographic Verification
- **SHA-256 hash generation** for each screenshot
- **MD5 hash generation** for additional verification
- Hash comparison to detect any modifications
- Tamper-proof evidence validation

### 📁 Case Management
- Create and manage legal cases
- Attach multiple screenshots to cases
- Organize evidence by case number
- Track case details and metadata

### 👥 User Management
- Secure authentication system
- Role-based access control (Admin/User)
- User profile management
- Password reset functionality

### 🎨 Modern UI/UX
- Clean, professional interface
- Intuitive navigation
- Responsive design
- Dark mode support

---

## 🏗️ Technology Stack

### Frontend (React Native)
- **Framework**: Expo SDK 53
- **Language**: JavaScript/TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: Expo Router (File-based routing)
- **UI Components**: React Native Paper
- **Key Libraries**:
  - `react-native-view-shot` - Screenshot capture
  - `expo-file-system` - Secure file storage
  - `crypto-js` - Hash generation
  - `expo-secure-store` - Encrypted storage
  - `expo-web-browser` - In-app browser
  - `axios` - API communication

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Email Service**: Nodemailer
- **Environment**: Node.js with nodemon

---

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Expo CLI** (installed globally)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- **Expo Go app** (on your mobile device for testing)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd "MOBILE APP"
```

### 2️⃣ Backend Setup

#### Navigate to Backend Directory
```bash
cd BACKEND
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `BACKEND` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/Evidential

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# Environment
NODE_ENV=development

# Cloudinary Configuration (for image storage)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Server Port
PORT=7002
```

#### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/Evidential` |
| `JWT_SECRET` | Secret key for JWT token generation | `your_random_secret_key_123` |
| `NODE_ENV` | Application environment | `development` or `production` |
| `CLOUD_NAME` | Cloudinary cloud name | Get from [Cloudinary Dashboard](https://cloudinary.com/) |
| `API_KEY` | Cloudinary API key | Get from Cloudinary Dashboard |
| `API_SECRET` | Cloudinary API secret | Get from Cloudinary Dashboard |
| `EMAIL_USER` | Email address for sending emails | `youremail@gmail.com` |
| `EMAIL_PASS` | Email app password (not regular password) | Generate from Google Account settings |
| `PORT` | Backend server port | `7002` |

#### Start Backend Server
```bash
npm start
```

The backend server will start on `http://localhost:7002`

---

### 3️⃣ Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../FRONTEND
```

#### Install Dependencies
```bash
npm install
```

#### Configure API Endpoint

Update the API base URL in `FRONTEND/redux/store.js` or your axios configuration:

```javascript
const API_URL = 'http://your-backend-url:7002/api';
```

For local development:
- **Android Emulator**: Use `http://10.0.2.2:7002/api`
- **iOS Simulator**: Use `http://localhost:7002/api`
- **Physical Device**: Use your computer's local IP (e.g., `http://192.168.1.100:7002/api`)

#### Start Expo Development Server
```bash
npx expo start
```

#### Run on Device/Emulator

After starting the Expo server, you'll see options to:

- Press `a` - Open on Android emulator
- Press `i` - Open on iOS simulator
- Scan QR code with **Expo Go** app on your physical device

---

## 📱 Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **Manage Users** - Create, approve, or suspend user accounts
3. **View All Cases** - Monitor all cases across the system
4. **Review Evidence** - Access all screenshots and verifications

### For Users

1. **Register** and wait for admin approval
2. **Login** to access the app
3. **Create Cases** - Start a new legal case
4. **Capture Screenshots**:
   - Open in-app browser
   - Navigate to social media platform
   - Capture screenshot securely
   - Hash is automatically generated
5. **Attach to Cases** - Link screenshots to relevant cases
6. **Verify Screenshots** - Check if evidence has been tampered with
7. **Export Evidence** - Prepare evidence for court presentation

---

## 🗂️ Project Structure

```
MOBILE APP/
├── BACKEND/
│   ├── controllers/        # Business logic
│   │   ├── Authentication.js
│   │   ├── Case.js
│   │   ├── Screenshot.js
│   │   ├── Users.js
│   │   └── ...
│   ├── models/            # Database schemas
│   │   ├── User.js
│   │   ├── Case.js
│   │   ├── Screenshot.js
│   │   └── TempUser.js
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json
│
├── FRONTEND/
│   ├── app/               # Expo Router pages
│   │   ├── (auth)/       # Authentication screens
│   │   ├── admin/        # Admin panel
│   │   ├── tabs/         # Main app tabs
│   │   └── _layout.jsx
│   ├── redux/            # State management
│   ├── assets/           # Images, fonts, icons
│   ├── constants/        # App constants
│   ├── utils/            # Utility functions
│   ├── app.json          # Expo configuration
│   └── package.json
│
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for passwords
- **Secure Storage** - Expo SecureStore for sensitive data
- **Hash Verification** - SHA-256 and MD5 for evidence integrity
- **Private Storage** - Screenshots never saved to device gallery
- **Role-Based Access** - Admin and user permission levels

---

## 🧪 Testing

### Backend Testing
```bash
cd BACKEND
npm test
```

### Frontend Testing
```bash
cd FRONTEND
npm run lint
```

---

## 📦 Building for Production

### Android APK
```bash
cd FRONTEND
npx expo build:android
```

### iOS IPA
```bash
cd FRONTEND
npx expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

---

## 🛠️ Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure MongoDB is running
- Check `.env` file configuration
- Verify port 7002 is not in use

**Frontend can't connect to backend:**
- Update API URL to match your network configuration
- Check firewall settings
- Ensure backend server is running

**Screenshots not saving:**
- Check file system permissions
- Verify Cloudinary credentials
- Check device storage space

**Hash verification fails:**
- Ensure screenshot hasn't been modified
- Check hash generation algorithm consistency
- Verify file integrity

---

## 🤝 Contributing

This is a government application with restricted access. Contributions are limited to authorized developers only.

---

## 📄 License

This application is proprietary software developed for government use. Unauthorized distribution or use is prohibited.

---

## 👥 Support

For technical support or issues:
- Contact our system administrator
- Email: admin@myntrixers.com
- Internal ticketing system

---

## 🔄 Version History

- **v1.0.0** - Initial release
  - Secure screenshot capture
  - Hash generation (SHA-256, MD5)
  - Case management
  - User authentication
  - Admin panel

---

## ⚖️ Legal Notice

This application is designed for use by authorized government personnel only. All captured evidence must be handled in accordance with local laws and regulations regarding digital evidence collection and chain of custody requirements.

**Important**: Ensure compliance with:
- Data protection regulations
- Privacy laws
- Evidence handling procedures
- Court admissibility standards

---

## 📞 Contact

For official inquiries regarding this application, please contact the development team through official government channels.

---

**Built with ❤️ for Justice and Truth**
