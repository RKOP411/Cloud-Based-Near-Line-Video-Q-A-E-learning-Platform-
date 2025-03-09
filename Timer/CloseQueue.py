import mysql.connector
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root12',
    'database': 'LearnPlatform'
}

def update_timeouts():
    try:
        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Get the current time
        current_time = datetime.now()

        # Query to update TimeOut for active queues
        query = """
        UPDATE queue_list
        SET TimeOut = GREATEST(TimeOut - 1, 0)
        WHERE Status = 'RUNNING';
        """
        cursor.execute(query)
        connection.commit()
        
        print(f"Updated TimeOut values as of {current_time}")

        # Query to close expired queues
        close_query = """
        UPDATE queue_list
        SET Status = 'CLOSED'
        WHERE Status = 'RUNNING' AND TimeOut = 0;
        """
        cursor.execute(close_query)
        connection.commit()
        
        print(f"Closed expired queues as of {current_time}")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        # Cleanup
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Scheduler to run the function every second
scheduler = BackgroundScheduler()
scheduler.add_job(update_timeouts, 'interval', seconds=1)  # Check every second
scheduler.start()

print("Queue management system is running in the background...")

# Keep the script running
try:
    while True:
        pass  # Replace with any other logic if needed
except (KeyboardInterrupt, SystemExit):
    scheduler.shutdown()