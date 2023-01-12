from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    owner_id = models.ForeignKey(User, models.CASCADE)
    title = models.CharField(max_length=100)
    create_dt = models.DateTimeField(auto_now_add=True)
    update_dt = models.DateTimeField(auto_now=True)
    # todo: pwd


class Member(models.Model):
    member_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, models.CASCADE)
    user = models.ForeignKey(User, models.CASCADE, blank=True, null=True)
    username = models.CharField(max_length=50, blank=True, null=True)
    #비회원은 user모델이 없으므로 지정하는 비회원의 username이므로 blank True


class Pay(models.Model):
    pay_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, models.CASCADE)
    payer = models.ForeignKey(Member, models.CASCADE)
    title = models.CharField(max_length=100)
    money = models.IntegerField()

class PayMember(models.Model):
    paymember_id = models.AutoField(primary_key=True)
    pay = models.ForeignKey(Pay, models.CASCADE)
    member = models.ForeignKey(Member, models.CASCADE)


class Friend(models.Model):
    friend_a = models.ForeignKey(User, models.SET_NULL, null=True, related_name='friend_a')
    friend_b = models.ForeignKey(User, models.SET_NULL, null=True, related_name='friend_b')
    #유저가 탈퇴한 경우 null이 되지만 입력 양식에서 빈 값을 넣을 수 없으므로 blank는 true로 설정하지 않음.
