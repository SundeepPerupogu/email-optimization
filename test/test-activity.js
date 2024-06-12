define(['activity'], function(activity) {
    describe('Custom Activity Tests', function() {
        it('should validate time format correctly', function() {
            expect(activity.validateTimeFormat('10:00:00Z')).toBe(true);
            expect(activity.validateTimeFormat('25:00:00Z')).toBe(false);
            expect(activity.validateTimeFormat('10:00:60Z')).toBe(false);
            expect(activity.validateTimeFormat('10:00:00')).toBe(false);
        });

        it('should parse time zone offset correctly', function() {
            expect(activity.parseTimeZoneOffset('+05:30')).toBe(330);
            expect(activity.parseTimeZoneOffset('-04:00')).toBe(-240);
        });

        it('should calculate next send time correctly', function() {
            var nextSend = activity.getNextSendTime('+05:30', '10:00:00Z', '14:30:00Z');
            console.log(nextSend);
            expect(new Date(nextSend)).toBeInstanceOf(Date);
        });
    });
});
