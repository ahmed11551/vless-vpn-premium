#!/bin/bash

# VLESS VPN Premium - Setup Script
echo "🚀 Setting up VLESS VPN Premium..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p server/uploads
mkdir -p server/logs
mkdir -p docker/ssl

# Copy environment files
echo "📋 Setting up environment files..."
if [ ! -f server/.env ]; then
    cp server/env.example server/.env
    echo "⚠️  Please edit server/.env with your configuration"
fi

if [ ! -f client/.env ]; then
    echo "REACT_APP_API_URL=http://localhost:3001/api" > client/.env
fi

if [ ! -f bot/.env ]; then
    echo "TELEGRAM_BOT_TOKEN=your-telegram-bot-token" > bot/.env
    echo "API_BASE_URL=http://localhost:3001/api" >> bot/.env
    echo "⚠️  Please edit bot/.env with your Telegram bot token"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Setup complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "🤖 Telegram Bot: Check bot/.env for token"
echo ""
echo "📝 Next steps:"
echo "1. Edit server/.env with your database and API keys"
echo "2. Edit bot/.env with your Telegram bot token"
echo "3. Run 'docker-compose restart' after making changes"
echo "4. Visit http://localhost:3000 to see the application"
echo ""
echo "📚 Documentation: https://github.com/vless-vpn/premium"
