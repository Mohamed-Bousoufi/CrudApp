#!/bin/bash
set -e

echo "========================================"
echo "  Backend Startup Script"
echo "========================================"

# ----------------------------------------
# Step 1: Wait for MySQL to be ready
# ----------------------------------------
echo ""
echo "[1/5] Waiting for MySQL..."

DB_HOST="${MYSQL_HOST:-mysql}"
DB_USER="${MYSQL_USER:-appuser}"
DB_PASS="${MYSQL_PASSWORD:-apppassword}"
DB_NAME="${MYSQL_DATABASE:-userdb}"

DJANGO_SUPERUSER_USERNAME="${DJANGO_SUPERUSER_USERNAME:-admin}"
DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD:-adminpass}"

echo "   Connecting to: $DB_HOST as $DB_USER"

max_retries=30
counter=0

until python - <<EOF 2>/dev/null
import MySQLdb
MySQLdb.connect(
    host="$DB_HOST",
    user="$DB_USER",
    passwd="$DB_PASS",
    db="$DB_NAME"
)
EOF
do
    counter=$((counter + 1))
    if [ "$counter" -gt "$max_retries" ]; then
        echo "❌ Failed to connect to MySQL after $max_retries attempts"
        exit 1
    fi
    echo "   Waiting... ($counter/$max_retries)"
    sleep 2
done

echo "✅ MySQL is ready!"

# ----------------------------------------
# Step 2: Make migrations
# ----------------------------------------
echo ""
echo "[2/5] Making migrations..."
python manage.py makemigrations --noinput
echo "✅ Done!"
echo "collecting static files..."
python manage.py collectstatic --noinput
# ----------------------------------------
# Step 3: Apply migrations + superuser
# ----------------------------------------
echo ""
echo "[3/5] Applying migrations..."
python manage.py migrate --noinput

echo "Creating superuser if it does not exist..."
python manage.py shell <<EOF
import os
from django.contrib.auth import get_user_model
from django.db import connection

User = get_user_model()
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "adminpass")

try:
    # Check if the user table exists
    tables = connection.introspection.table_names()
    if User._meta.db_table in tables:
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, password=password)
            print("Superuser created")
        else:
            print("Superuser already exists")
    else:
        print(f"User table {User._meta.db_table} does not exist yet.")
except Exception as e:
    print(f"Error creating superuser: {e}")
EOF

echo "✅ Migrations applied!"

# ----------------------------------------
# Step 4: Check tables
# ----------------------------------------
echo ""
echo "[4/5] Checking database tables..."
python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute('SHOW TABLES')
tables = cursor.fetchall()
print(f'   Found {len(tables)} tables')
for t in tables:
    print(f'   - {t[0]}')
"

# ----------------------------------------
# Step 5: Create sample users
# ----------------------------------------
echo ""
echo "[5/5] Creating sample users..."
python manage.py shell -c "
from api.models import User

users = [
    {'first_name': 'John', 'last_name': 'Doe', 'email': 'john@example.com', 'gender': 'Male', 'age': 28},
    {'first_name': 'Jane', 'last_name': 'Smith', 'email': 'jane@example.com', 'gender': 'Female', 'age': 34},
    {'first_name': 'Alice', 'last_name': 'Johnson', 'email': 'alice@example.com', 'gender': 'Female', 'age': 29},
    {'first_name': 'Bob', 'last_name': 'Wilson', 'email': 'bob@example.com', 'gender': 'Male', 'age': 45},
]

for u in users:
    obj, created = User.objects.get_or_create(email=u['email'], defaults=u)
    if created:
        print(f\"   + Created: {u['first_name']}\")
print(f'   Total: {User.objects.count()} users')
"

echo ""
echo "========================================"
echo "  Startup Complete!"
echo "========================================"

# ----------------------------------------
# Start Django server
# ----------------------------------------
echo ""
echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000
