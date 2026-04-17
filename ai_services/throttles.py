from rest_framework.throttling import UserRateThrottle

class SensitiveThrottle(UserRateThrottle):
    scope = 'sensitive'
