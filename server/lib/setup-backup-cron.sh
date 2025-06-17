#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKUP_SCRIPT="$SCRIPT_DIR/backup.js"
chmod +x "$BACKUP_SCRIPT"
CRON_JOB="0 2 * * * $BACKUP_SCRIPT"

if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo "Cron job already exists"
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "Cron job has been added successfully"
    echo "The backup will run every day at 2 AM"
fi

echo -e "\nCurrent crontab entries:"
crontab -l 