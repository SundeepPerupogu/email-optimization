from datetime import datetime, timedelta
import pytz
import re

class SendTimeCalculator:
    def __init__(self, start_window: str, end_window: str):
        self.start_window = start_window
        self.end_window = end_window

    def validate(self):
        # Validate time format
        time_format = re.compile(r'^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)Z$')
        if not time_format.match(self.start_window) or not time_format.match(self.end_window):
            raise ValueError("Start window and end window must be in ISO8601 time format (HH:MM:SSZ).")
        
        # Validate that start and end window are not the same
        if self.start_window == self.end_window:
            raise ValueError("Start window and end window must not be the same.")

    def calculate_next_send_time(self, time_zone: str):
        # Parse the input times
        start_window_utc = datetime.strptime(self.start_window, "%H:%M:%SZ").time()
        end_window_utc = datetime.strptime(self.end_window, "%H:%M:%SZ").time()
        
        # Get the current datetime in UTC
        current_datetime_utc = datetime.utcnow().replace(tzinfo=pytz.utc)
        current_date_utc = current_datetime_utc.date()
        current_time_utc = current_datetime_utc.time()
        
        # Apply the user's timezone offset
        user_tz = pytz.timezone('Etc/GMT' + time_zone.replace(':', ''))
        
        user_start_window = datetime.combine(current_date_utc, start_window_utc).astimezone(user_tz)
        user_end_window = datetime.combine(current_date_utc, end_window_utc).astimezone(user_tz)
        
        if start_window_utc < end_window_utc:
            if user_start_window.time() <= current_time_utc <= user_end_window.time() - timedelta(minutes=5):
                next_send = datetime.combine(current_date_utc, start_window_utc).astimezone(pytz.utc)
            else:
                next_send = (datetime.combine(current_date_utc, start_window_utc) + timedelta(days=1)).astimezone(pytz.utc)
        else:
            if user_start_window.time() <= current_time_utc <= (user_end_window + timedelta(days=1)).time() - timedelta(minutes=5):
                next_send = datetime.combine(current_date_utc, start_window_utc).astimezone(pytz.utc)
            else:
                next_send = (datetime.combine(current_date_utc, start_window_utc) + timedelta(days=1)).astimezone(pytz.utc)
        
        return next_send.isoformat()

# Example usage
if __name__ == '__main__':
    calculator = SendTimeCalculator("10:00:00Z", "14:30:00Z")
    calculator.validate()
    next_send_time = calculator.calculate_next_send_time("+05:30")
    print(next_send_time)
