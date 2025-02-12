import mysql.connector
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root12',
    'database': 'LearnPlatform'
}

def update_timeouts():
    # Connect to the database
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Get the current time
    current_time = datetime.now()

    # Query to update TimeOut for active queues
    query = """
    UPDATE Queue_list
    SET TimeOut = GREATEST(TimeOut - 60, 0)  -- Decrease TimeOut by 60 seconds, ensuring it doesn't go below 0
    WHERE Status = 'Open';
    """
    cursor.execute(query)
    connection.commit()
    
    print(f"Updated TimeOut values as of {current_time}")

    # Query to close expired queues
    close_query = """
    UPDATE Queue_list
    SET Status = 'Close'
    WHERE Status = 'Open' AND
          (TIMESTAMPDIFF(SECOND, Created, %s) >= TimeOut);
    """
    cursor.execute(close_query, (current_time,))
    connection.commit()
    
    print(f"Closed expired queues as of {current_time}")

    # Cleanup
    cursor.close()
    connection.close()

# Scheduler to run the function periodically
scheduler = BackgroundScheduler()
scheduler.add_job(update_timeouts, 'interval', seconds=60)  # Check every minute
scheduler.start()

print("Queue management system is running in the background...")

# Keep the script running
try:
    while True:
        pass  # Replace with any other logic if needed
except (KeyboardInterrupt, SystemExit):
    scheduler.shutdown()