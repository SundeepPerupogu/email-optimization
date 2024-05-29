import unittest
from unittest.mock import patch
from datetime import datetime
from backend.customActivity import SendTimeCalculator

class TestSendTimeCalculator(unittest.TestCase):
    
    def test_validation_success(self):
        calculator = SendTimeCalculator("10:00:00Z", "14:30:00Z")
        try:
            calculator.validate()
        except ValueError as e:
            self.fail(f"Validation failed with error: {e}")
    
    def test_validation_failure_same_times(self):
        calculator = SendTimeCalculator("10:00:00Z", "10:00:00Z")
        with self.assertRaises(ValueError):
            calculator.validate()
    
    def test_validation_failure_invalid_format(self):
        calculator = SendTimeCalculator("10:00:00", "14:30:00Z")
        with self.assertRaises(ValueError):
            calculator.validate()
    
    @patch('datetime.datetime')
    def test_calculate_next_send_time(self, mock_datetime):
        mock_datetime.utcnow = lambda: datetime(2024, 5, 16, 9, 0, 0)
        calculator = SendTimeCalculator("10:00:00Z", "14:30:00Z")
        next_send_time = calculator.calculate_next_send_time("+5:30")
        self.assertEqual(next_send_time, "2024-05-16T10:00:00+00:00")
    
    @patch('datetime.datetime')
    def test_calculate_next_send_time_past_window(self, mock_datetime):
        mock_datetime.utcnow = lambda: datetime(2024, 5, 16, 15, 0, 0)
        calculator = SendTimeCalculator("10:00:00Z", "14:30:00Z")
        next_send_time = calculator.calculate_next_send_time("+5:30")
        self.assertEqual(next_send_time, "2024-05-17T10:00:00+00:00")

if __name__ == '__main__':
    unittest.main()
