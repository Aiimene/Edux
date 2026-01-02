#!/bin/bash
# Fix backend syntax error and restart

echo "🔧 Fixing backend syntax error..."

# Fix the max_users field syntax in models.py
docker exec -i $(docker ps -aq -f name=backend) bash -c "
cat > /tmp/fix_models.py << 'PYEOF'
import re

with open('apps/settings/models.py', 'r') as f:
    content = f.read()

# Remove the broken max_users field if it exists with escaped quotes
content = re.sub(
    r'max_users = models\.IntegerField\(\s*default=999999,\s*help_text=\\\\\"Maximum[^\"]*\\\\\"\s*\)',
    'max_users = models.IntegerField(\n        default=999999,\n        help_text=\"Maximum number of users allowed (999999 = unlimited)\"\n    )',
    content,
    flags=re.DOTALL
)

# If max_users doesn't exist, add it after payment_method
if 'max_users = models.IntegerField' not in content:
    pattern = r'(payment_method = models\.CharField\([^)]+\)\s*\n\s*\)\s*\n)'
    replacement = r'\1    max_users = models.IntegerField(\n        default=999999,\n        help_text=\"Maximum number of users allowed (999999 = unlimited)\"\n    )\n'
    content = re.sub(pattern, replacement, content)

with open('apps/settings/models.py', 'w') as f:
    f.write(content)
print('Fixed models.py')
PYEOF
python /tmp/fix_models.py
"

# Check if syntax is correct
echo "✅ Checking syntax..."
docker exec -i $(docker ps -aq -f name=backend) bash -c "python manage.py check 2>&1 | tail -3"

# If check passes, restart backend
if [ $? -eq 0 ]; then
    echo "✅ Syntax is correct. Restarting backend..."
    cd /home/edux-manager/htdocs/edux-manager.online/backend
    docker-compose restart backend
    sleep 8
    echo "✅ Backend restarted. Checking status..."
    docker ps | grep backend
    docker logs --tail 10 $(docker ps -q -f name=backend) 2>&1 | tail -5
else
    echo "❌ Syntax error still exists. Please check manually."
fi

