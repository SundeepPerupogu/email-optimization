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
    
    def test
