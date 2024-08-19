const assert = require('assert');
const calculateNextSendTime = require('../server').calculateNextSendTime;

describe('Custom Activity', () => {
    it('should calculate the correct next send time', () => {
        const result = calculateNextSendTime('+05:30', '10:00:00Z', '14:30:00Z', 'weekday');
        assert.strictEqual(result, 'expected_time');
    });
});
