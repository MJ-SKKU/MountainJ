from rest_framework import serializers
from .models import *
from users.models import CustomUser

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('project_id', 'owner', 'title', 'event_dt', 'end_dt')


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('member_id', 'project', 'user', 'username')


class PaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pay
        fields = ('pay_id', 'project', 'payer', 'title', 'money')

class PayMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('paymember_id', 'pay', 'member')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'password', 'is_active', 'k_id', 'k_mail', 'k_mail', 'k_name')
