# Backend 502 Error Fix Instructions

## Problem
The backend is returning 502 Bad Gateway because the container crashed due to a syntax error in `apps/settings/models.py` (line 121) with the `max_users` field.

## Quick Fix

SSH into your VPS and run:

```bash
# 1. Check backend container status
docker ps -a | grep backend

# 2. Fix the syntax error in models.py
docker exec -i $(docker ps -aq -f name=backend) bash -c "
sed -i 's/help_text=\\\\\"Maximum/help_text=\"Maximum/g' apps/settings/models.py
sed -i 's/(999999 = unlimited)\\\\\"/(999999 = unlimited)\"/g' apps/settings/models.py
"

# 3. Verify syntax is correct
docker exec -i $(docker ps -aq -f name=backend) bash -c "python manage.py check"

# 4. If check passes, restart backend
cd /home/edux-manager/htdocs/edux-manager.online/backend
docker-compose restart backend

# 5. Wait and check status
sleep 10
docker ps | grep backend
docker logs --tail 20 $(docker ps -q -f name=backend)
```

## Alternative: Manual Fix

If the above doesn't work, manually edit the file:

```bash
docker exec -it $(docker ps -aq -f name=backend) bash
nano apps/settings/models.py
```

Find line ~121 and change:
```python
help_text=\"Maximum number of users allowed (999999 = unlimited)\"
```

To:
```python
help_text="Maximum number of users allowed (999999 = unlimited)"
```

(Remove the backslashes before the quotes)

Then save and restart:
```bash
exit
docker-compose restart backend
```

## Verify Fix

After restarting, test the endpoints:
```bash
curl http://localhost:8000/api/auth/register/ -X POST -H "Content-Type: application/json" -d '{}'
```

Should return a validation error (not 502), which means the backend is working.

