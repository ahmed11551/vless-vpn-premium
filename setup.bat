@echo off
REM VLESS VPN Premium - Windows Setup Script
echo 🚀 Setting up VLESS VPN Premium...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist "server\uploads" mkdir server\uploads
if not exist "server\logs" mkdir server\logs
if not exist "docker\ssl" mkdir docker\ssl

REM Copy environment files
echo 📋 Setting up environment files...
if not exist "server\.env" (
    copy "server\env.example" "server\.env"
    echo ⚠️  Please edit server\.env with your configuration
)

if not exist "client\.env" (
    echo REACT_APP_API_URL=http://localhost:3001/api > client\.env
)

if not exist "bot\.env" (
    echo TELEGRAM_BOT_TOKEN=your-telegram-bot-token > bot\.env
    echo API_BASE_URL=http://localhost:3001/api >> bot\.env
    echo ⚠️  Please edit bot\.env with your Telegram bot token
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo ✅ Setup complete!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001
echo 🤖 Telegram Bot: Check bot\.env for token
echo.
echo 📝 Next steps:
echo 1. Edit server\.env with your database and API keys
echo 2. Edit bot\.env with your Telegram bot token
echo 3. Run 'docker-compose restart' after making changes
echo 4. Visit http://localhost:3000 to see the application
echo.
echo 📚 Documentation: https://github.com/vless-vpn/premium
pause
