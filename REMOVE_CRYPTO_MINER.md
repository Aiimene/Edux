# 🚨 CRITICAL: Crypto Miner Detected - Removal Instructions

## What This Is:
This is a **cryptocurrency mining malware** installed by a hacker. It's using 100% of your CPU to mine cryptocurrency for the attacker.

## IMMEDIATE ACTIONS - Run These Commands NOW:

### 1. Kill the Mining Process
```bash
# Find and kill the process
ps aux | grep -E "(sysls|unmineable|xmrig|miner)" | grep -v grep
pkill -9 -f "sysls"
pkill -9 -f "unmineable"
pkill -9 -f "xmrig"
pkill -9 -f "miner"

# Kill by process name
killall -9 sysls 2>/dev/null
```

### 2. Find and Remove the Malicious Executable
```bash
# Find where it's located
which sysls
find /usr/bin -name "sysls" -type f
find /usr/local/bin -name "sysls" -type f
find /tmp -name "sysls" -type f
find /var/tmp -name "sysls" -type f
find /home -name "sysls" -type f 2>/dev/null

# Remove it
rm -f /usr/bin/sysls
rm -f /usr/local/bin/sysls
rm -f /tmp/sysls
rm -f /var/tmp/sysls

# Check for other suspicious files
find /usr/bin -name "*miner*" -o -name "*xmrig*" -o -name "*crypto*"
```

### 3. Check for Cron Jobs (Auto-restart)
```bash
# Check all cron jobs
crontab -l
crontab -l -u root
cat /etc/crontab
ls -la /etc/cron.d/
ls -la /etc/cron.hourly/
ls -la /etc/cron.daily/
ls -la /var/spool/cron/crontabs/

# Look for suspicious entries
grep -r "sysls\|unmineable\|xmrig\|miner" /etc/cron* /var/spool/cron/
```

### 4. Check for Systemd Services (Auto-restart)
```bash
# Check for malicious services
systemctl list-units --type=service | grep -E "(sysls|miner|xmrig)"
ls -la /etc/systemd/system/ | grep -E "(sysls|miner|xmrig)"
cat /etc/systemd/system/*.service | grep -E "(sysls|unmineable)"

# Stop and remove malicious services
systemctl stop sysls 2>/dev/null
systemctl disable sysls 2>/dev/null
rm -f /etc/systemd/system/sysls.service
systemctl daemon-reload
```

### 5. Check Running Processes
```bash
# Check all running processes
ps aux | grep -v "\[" | sort -k3 -rn | head -20

# Look for high CPU usage
top -bn1 | head -20

# Check network connections
netstat -tulpn | grep -E "(unmineable|443)"
ss -tulpn | grep -E "(unmineable|443)"
```

### 6. Check for Other Malware
```bash
# Check for common miner names
ps aux | grep -E "(xmrig|cpuminer|minerd|ccminer|nicehash|stratum)" | grep -v grep

# Check for suspicious network activity
netstat -antp | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10
```

### 7. Check File Permissions
```bash
# Find files with suspicious permissions
find /usr/bin /usr/local/bin /tmp /var/tmp -perm -4000 -o -perm -2000 2>/dev/null
find /usr/bin /usr/local/bin -user root -perm -4000 2>/dev/null
```

### 8. Check Recent File Modifications
```bash
# Find recently modified files in system directories
find /usr/bin /usr/local/bin /etc -mtime -7 -type f 2>/dev/null | head -20
```

## Complete Removal Script:

```bash
#!/bin/bash
echo "=== Removing Crypto Miner ==="

# 1. Kill processes
echo "Killing processes..."
pkill -9 -f "sysls"
pkill -9 -f "unmineable"
pkill -9 -f "xmrig"
pkill -9 -f "miner"
killall -9 sysls 2>/dev/null

# 2. Remove executable
echo "Removing executable..."
rm -f /usr/bin/sysls
rm -f /usr/local/bin/sysls
rm -f /tmp/sysls
rm -f /var/tmp/sysls

# 3. Remove from cron
echo "Removing from cron..."
crontab -l | grep -v "sysls\|unmineable\|xmrig" | crontab -
sed -i '/sysls\|unmineable\|xmrig/d' /etc/crontab 2>/dev/null
rm -f /etc/cron.d/*sysls* /etc/cron.d/*miner* 2>/dev/null

# 4. Remove systemd service
echo "Removing systemd service..."
systemctl stop sysls 2>/dev/null
systemctl disable sysls 2>/dev/null
rm -f /etc/systemd/system/sysls.service
systemctl daemon-reload

# 5. Check CPU
echo "Checking CPU usage..."
top -bn1 | head -5

echo "=== Done ==="
```

## How This Got Installed:

Likely through:
1. The shell scripts we deployed (`apply-security-fix.sh`, `setup-google-signin.sh`)
2. A compromised SSH password
3. A vulnerability in the application
4. Malicious files uploaded to the server

## Security Measures After Removal:

1. **Change all passwords** (SSH, database, etc.)
2. **Set up SSH key authentication** (disable password login)
3. **Install fail2ban** to prevent brute force attacks
4. **Update all software** to latest versions
5. **Review all cron jobs and systemd services**
6. **Monitor CPU usage** regularly
7. **Set up intrusion detection** (like AIDE or rkhunter)

## Check for Backdoors:

```bash
# Check for suspicious SSH keys
cat ~/.ssh/authorized_keys
cat /root/.ssh/authorized_keys

# Check for suspicious users
cat /etc/passwd | grep -E "(nologin|false)" | grep -v "systemd\|sync\|halt\|shutdown"

# Check for SUID binaries
find / -perm -4000 -type f 2>/dev/null | xargs ls -la
```


