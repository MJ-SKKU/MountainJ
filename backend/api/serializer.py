from rest_framework import serializers
from .models import *

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('project_id', 'owner_id', 'title', 'create_dt', 'update_dt')


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
        model = User
        fields = ('id', 'email', 'username', 'password', 'is_active')