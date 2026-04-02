from rest_framework import serializers
from django.contrib.auth.models import User

# ─── Serializer 1: Register ──────────────────────────────────────────
# Used when a new user signs up
# Validates the data, then creates the user in the database


class RegisterSerializer(serializers.ModelSerializer):
    # password2 is only for validation — it's not a model field
    # write_only=True means it will never be sent back in a response

    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # the fields frontend must send
        fields = ["username", "email", "password", "password2"]

    def validate(self, data):
        # Check Passwords Match
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"Password": "Passwords don't match."})

        # Check If Email already Exists
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"Email": "Email Already Registered."})

        return data

    def create(self, validated_data):
        # Remove the password2 as it is only for validation
        validated_data.pop("password2", None)

        # Create user with hashed password output
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


# Serializer 2: User Profile
# Used to return user info to the frontend
# Never exposes the password — read only


class UserSerialzer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        # Id is always read-only; database assigns it
        read_only_fields = ["id"]
