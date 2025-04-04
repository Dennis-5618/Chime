# Chime
Chime is an open-source Discord bot made with discord.js v14. It's goal is to enhance your server by making management easier and more fun.

## ⚠️ Work in progress
Chime is still in early development and new features might be introduced frequently. As a result, compatibility between versions is not guaranteed.

## ✨Features
✅ Easy to understand code - Well-structured and beginner-friendly

✅ Robust command and error handling - Ensures smooth performance

✅ Advanced ticket system - Manage support tickets easily

✅ Giveaway system - give back to your community

✅ MongoDB integration - Simple yet powerful database solution

## 📌Planned Features
🚧 Various moderation commands

🚧 Logging system

🚧 Polls

## 🛠️ Installation
To install Chime yourself you can follow the following steps

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Dennis-5618/Chime.git
cd Chime
```

### 2️⃣ Install dependencies
Run the following command to install all required dependencies automatically:
```bash
npm install
```

Alternatively, if you want to install the dependencies manually:
```bash
npm install discord.js dotenv mongoose ms
```

### 3️⃣ Setup environment variables
Create a `.env` file in the root directory and add the following
```bash
# Discord Credentials
TOKEN = '<Bot token here>'
CLIENT_ID = '<Client ID here>'
GUILD_ID = '<Development server ID here>'

# Database Credentials
MONGODB = '<MongoDB uri here>'
```

### 4️⃣ Enjoy!
Your bot is now up and running