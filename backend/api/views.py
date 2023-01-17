from django.shortcuts import render
from .serializer import *
from django.contrib.auth import login, authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
import json
from django.db import transaction


from .models import *

from django.conf import settings
# from accounts.models import User
# from allauth.socialaccount.models import SocialAccount
from django.conf import settings
# from dj_rest_auth.registration.views import SocialLoginView
# from allauth.socialaccount.providers.google import views as google_view
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.http import JsonResponse
import requests
from rest_framework import status
from json.decoder import JSONDecodeError
from django.shortcuts import render, redirect
import jwt
from dotenv import load_dotenv
import os
from pathlib import Path
from django.http import HttpResponse



def kakao_login(request):

    SECRET_KEY = os.environ.get("SECRET_KEY")
    ALGORITHM = os.environ.get("ALGORITHM")

    kakao_access_code = request.GET.get('code', None)
    url = "https://kapi.kakao.com/v2/user/me"
    headers={
                "Authorization":f"Bearer {kakao_access_code}",
                "Content-type":"application/x-www-form-urlencoded; charset=utf-8"
            }
    kakao_response = requests.post(url, headers=headers)
    kakao_response = json.loads(kakao_response.text)

    if User.objects.filter(k_id=kakao_response['id']).exists():
        user = User.objects.get(uid=kakao_response['id'])
        jwt_token = jwt.encode({'id': user.id}, SECRET_KEY, ALGORITHM)

        return HttpResponse(f'user:{user}, kakao_name:{user.k_name}, token:{jwt_token}, exist:true')
    else:
        User(
            k_id=kakao_response['id'],
            kakao=True,
            k_mail=kakao_response['kakao_account'].get('email', None),
            k_name=kakao_response['properties']['nickname'],

        ).save()
        user = User.objects.get(uid=kakao_response['id'])
        jwt_token = jwt.encode({'id': user.id}, SECRET_KEY, ALGORITHM)
        return HttpResponse(f'user:{user}, token:{jwt_token}, exist:false')



class UserListAPI(APIView):
    # 사용자 등록 (회원가입)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 사용자로그인
# def loginAPI:

#todo: error status 코드 고치기
class UserAPI(APIView):
    # 사용자조회
    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)


# todo: Serializer 구분
class FriendUserListAPI(APIView):
    # 친구리스트 조회
    def get(self, request, user_id):
        user = User.objects.get(user_id)
        li1 = Friend.objects.filter(friend_a=user).values_list('friend_b')
        li2 = Friend.objects.filter(friend_b=user).values_list('friend_a')
        li = li1 + li2
        users = User.objects.filter(id__in=li)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class FriendAPI(APIView):
    # 친구 등록
    def post(self, request):
        serializer = FriendSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # 친구 삭제
    # todo: 코드 고치기
    def delete(self, request):
        print(request.data)
        u1 = request.data.x
        u2 = request.data.y
        friend = Friend.objects.filter(friend_a__user=u1).filter(friend_b__user=u2).first()
        if friend is None:
            friend = Friend.objects.filter(friend_b__user=u1).filter(friend_a__user=u2).first()
        friend.delete()
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class ProjectListAPI(APIView):
    # 프로젝트 리스트 조회
    def get(self, request, owner_id=None):
        if owner_id is None:
            # 전체 정산 프로젝트 조회
            projects = Project.objects.all()
        else:
            # 조회 필터, 특정 User가 소유한 정산 프로젝트를 조회
            user = User.objects.get(id=owner_id)
            li = Member.objects.filter(user=user).values_list('project')
            projects = Project.objects.filter(project_id__in=li)

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 프로젝트 생성
    @transaction.atomic
    def post(self, request):

        try:
            with transaction.atomic():
                owner_id = request.POST.get('owner_id')
                user = User.objects.get(id=owner_id)

                reqData = request.data
                title = reqData['title']
                #todo: pwd
                project = Project.objects.create(owner_id=user, title=request.POST.get('title'))

                name_li = json.loads(request.POST.get('name_li'))
                for name in name_li:
                    Member.objects.create(project=project, username=name)

                members = Member.objects.filter(projecc=project)
                serializer1 = MemberSerializer(members, many=True)
                serializer2 = ProjectSerializer(project)

                if project:
                    return Response({"members":serializer1, "project":serializer2}, status=status.HTTP_200_OK)
        except:
            return Response(reqData, status=status.HTTP_400_BAD_REQUEST)



class ProjectAPI(APIView):
    # 프로젝트 조회
    def get(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 프로젝트 수정
    @transaction.atomic()
    def patch(self, request, project_id):
        try:
            with transaction.atomic():
                project = Project.objects.get(project_id=project_id)

                req_name_li = json.loads(request.POST.get('name_li'))
                db_name_li = Member.objects.filter(project=project).values_list('username')

                add_name_li = set(req_name_li) - set(db_name_li)
                del_name_li = set(db_name_li) - set(req_name_li)

                for name in add_name_li:
                    Member.objects.create(project=project, username=name)
                for name in del_name_li:
                    Member.objects.get(project=project, username=name).delete()

                members = Member.objects.filter(project=project)
                serializer1 = MemberSerializer(members, many=True)
                serializer2 = ProjectSerializer(project, data=request.data, partial=True)

                if (serializer2.is_valid()):
                    serializer1.save()
                    serializer2.save()
                    return Response({"members":serializer1, "project":serializer2}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # # 프로젝트 삭제
    # def delete(self, request, project_id):
    #     project = Project.objects.get(project_id=project_id)
    #     project.delete()
    #     return Response({}, status=status.HTTP_204_NO_CONTENT)


class MemberListAPI(APIView):
    # 프로젝트 멤버 조회
    def get(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        members = Member.objects.filter(project=project)
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 프로젝트 멤버 생성
    def post(self, request):
        # request.POST._mutable = True
        # request.POST['test'] = "test~"
        project = Project.objects.get(project_id=request.POST.get('project_id'))

        name_li = json.loads(request.POST.get('name_li'))

        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 프로젝트 멤버 삭제
class MemberAPI(APIView):
    # 정산 멤버 생성(단일)
    def post(self, request):
        project = Project.objects.get(project_id=request.POST.get('project_id'))
        username = request.POST.get('project_id')
        user_id = request.POST.get('user_id')
        # todo: test
        member = Member.objects.create(project=project, username=username, user__id=user_id)

        serializer = MemberSerializer(member)

        return Response(serializer, status=status.HTTP_200_OK)



    def delete(self, member_id):
        member = Member.objects.get(member_id=member_id)
        member.delete()
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class PayListAPI(APIView):
    # 프로젝트 페이 리스트 조회
    def get(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        pays = Pay.objects.filter(project=project)
        serializer = PaySerializer(pays, many=True)
        return Response(serializer.data)

    # 프로젝트 페이 생성
    @transaction.atomic()
    def post(self, request, project_id):

        try:
            with transaction.atomic():
                serializer = PaySerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()

                    pay_member = json.loads(request.POST.get('pay_member'))
                    for member_id in pay_member:
                        PayMember.objects.create(pay__id=serializer.pay_id, member__id=member_id)

                    paymembers = PayMember.objects.filter(pay__id=serializer.pay_id)
                    paymember_s = PayMemberSerializer(data=paymembers, many=True)

                return Response({"pay":serializer.data,"pay_member":paymember_s}, status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PayAPI(APIView):
    # 프로젝트 페이 조회
    def get(self, request, pay_id):
        pay = Pay.objects.get(pay_id=pay_id)
        serializer = PaySerializer(pay)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 프로젝트 페이 수정
    @transaction.atomic()
    def patch(self, request, pay_id):
        try:
            with transaction.atomic():
                pay = Pay.objects.get(pay_id=pay_id)
                serializer = PaySerializer(pay, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()

                    req_mem_li = json.loads(request.POST.get('pay_member'))
                    db_mem_li = PayMember.objects.filter(pay=pay).values_list('member_id')

                    add_mem_li = set(req_mem_li) - set(db_mem_li)
                    del_mem_li = set(db_mem_li) - set(req_mem_li)

                    for mem_id in add_mem_li:
                        PayMember.objects.create(pay__id=pay__id, member__id=mem_id)
                    for mem_id in del_mem_li:
                        PayMember.objects.get(pay__id=pay__id, member__id=mem_id).delete()

                    paymembers = PayMember.objects.filter(pay__id=pay_id)
                    paymember_s = PayMemberSerializer(data=paymembers, many=True)

                return Response({"pay":serializer.data,"pay_member":paymember_s}, status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # 프로젝트 페이 삭제
    def delete(self, request, pay_id):
        pay = Pay.objects.get(pay_id=pay_id)
        pay.delete()
        return Response({}, status=status.HTTP_200_OK)

# 페이 멤버 리스트 조회 - 페이 기준
def get_pay_member_list(self, request, pay_id):
    li = PayMember.objects.get(pay__id=pay_id).values_list('member')
    members = Member.objects.filter(member_id__in=li)
    serializer = MemberSerializer(members, many=True)
    return Response(serializer.data)

# 페이 멤버 리스트 조회 - 멤버 기준
def get_member_pay_list(self, request, member_id):
    li = PayMember.objects.get(member_id=member_id).values_list('pay')
    pays = Pay.objects.filter(pay_id__in=li)
    serializer = PaySerializer(pays, many=True)
    return Response(serializer.data)


class LoginAPI(APIView):
    # 사용자 로그인
    def post(self, request):
        reqData = request.data
        email = reqData['email']  # request.POST.get('email') #['email']
        password = reqData['password']
        print(f'user email = {email}\nuser password = {password}')
        try:
            user = User.objects.get(email=email,password=password)
            # user = authenticate(request, username=email, password=password)
            serializer = UserSerializer(user)
            if user:
                return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(f"login failed", status=status.HTTP_400_BAD_REQUEST)
