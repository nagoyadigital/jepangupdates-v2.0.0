#!/bin/bash
# ============================================
# Setup PostgreSQL di VPS Tencent
# Jalankan: ssh root@43.156.93.105 'bash -s' < setup-vps.sh
# ============================================

echo "🚀 Memulai setup PostgreSQL..."

# Update system
apt update -y

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start & enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
echo "📦 Membuat database dan user..."
sudo -u postgres psql <<EOF
CREATE USER japanuser WITH PASSWORD 'JepangUpdates2026!Secure';
CREATE DATABASE japanupdates OWNER japanuser;
GRANT ALL PRIVILEGES ON DATABASE japanupdates TO japanuser;
\c japanupdates
GRANT ALL ON SCHEMA public TO japanuser;
EOF

# Allow remote connections (untuk development dari lokal)
PG_HBA=$(find /etc/postgresql -name "pg_hba.conf" | head -1)
PG_CONF=$(find /etc/postgresql -name "postgresql.conf" | head -1)

# Allow password auth from any IP (untuk development)
echo "host    japanupdates    japanuser    0.0.0.0/0    md5" >> "$PG_HBA"

# Listen on all interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"

# Restart PostgreSQL
systemctl restart postgresql

# Open firewall port 5432
ufw allow 5432/tcp 2>/dev/null || true

echo ""
echo "✅ PostgreSQL berhasil diinstall!"
echo ""
echo "📋 Connection String:"
echo "DATABASE_URL=\"postgresql://japanuser:JepangUpdates2026!Secure@43.156.93.105:5432/japanupdates?schema=public\""
echo ""
echo "🔑 Database Credentials:"
echo "  Host: 43.156.93.105"
echo "  Port: 5432"
echo "  Database: japanupdates"
echo "  User: japanuser"
echo "  Password: JepangUpdates2026!Secure"
echo ""
echo "⚠️  Jangan lupa ganti password VPS setelah setup selesai!"
