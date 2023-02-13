from queue import PriorityQueue
from django.shortcuts import render
from .serializer import *
from django.http import JsonResponse
from django.contrib.auth import login, authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from django.contrib.auth.models import User

# from .models import CustomUser as User
import json
import math
import random
from django.db import transaction


from .models import *

import requests
from rest_framework import status
from json.decoder import JSONDecodeError
from django.shortcuts import render, redirect
import jwt
from dotenv import load_dotenv
import os
from pathlib import Path
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View

from users.models import CustomUser as User

def delete_member_one_pay():
    pays = Pay.objects.all()
    for pay in pays:
        paymembers = PayMember.objects.filter(pay=pay)
        if paymembers.count() == 1:
            PayMember.objects.get(pay=pay).delete()
            pay.delete()

class kakao_callback(APIView):
    def post(self, request):
        REDIRECT_URI = os.environ.get("REDIRECT_URI")
        REST_API_KEY = os.environ.get("REST_API_KEY")
        SECRET_KEY = os.environ.get("SECRET_KEY")
        ALGORITHM = os.environ.get("ALGORITHM")
        data = {
            "grant_type": "authorization_code",
            "client_id": REST_API_KEY,
            "redirection_uri": REDIRECT_URI,
            "code": request.POST.get('code'),
        }
        kakao_token_api = "https://kauth.kakao.com/oauth/token"
        tmp= requests.post(kakao_token_api, data=data).json()

        result = {'status': 200}

        if 'error' in tmp:
            result['error'] = tmp['error']
            result['status'] = 500
            return HttpResponse(json.dumps(result), content_type = 'application/javascript; charset=utf8')
        else:
            access_token = tmp["access_token"]


            kakao_user_api = "https://kapi.kakao.com/v2/user/me"
            user_information = requests.get(kakao_user_api, headers={"Authorization": f"Bearer ${access_token}"}).json()

            kakao_response = user_information


            if User.objects.filter(k_id=kakao_response['id']).exists():
                user = User.objects.get(k_id=kakao_response['id'])
                jwt_token = jwt.encode({'id': user.id}, SECRET_KEY, ALGORITHM)

                result['token'] = jwt_token
                result['user'] =  UserSerializer(user).data
                result['exist'] = 'true'

                return Response(result, status=200)

            else:
                User(
                    k_id=kakao_response['id'],
                    kakao=True,
                    k_mail=kakao_response['kakao_account'].get('email', None),
                    k_name=kakao_response['properties']['nickname'],
                ).save()
                user = User.objects.get(k_id=kakao_response['id'])
                jwt_token = jwt.encode({'id': user.id}, SECRET_KEY, ALGORITHM)

                result['token'] = jwt_token
                result['user'] = UserSerializer(user).data
                result['exist'] = 'false'

                return Response(result, status=200)


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
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"err_code":111, "message":"없는 사용자입니다."}, status=status.HTTP_400_BAD_REQUEST)


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
        print(request.GET)
        print(owner_id)
        if owner_id is not None:
        # 조회 필터, 특정 User가 소유한 정산 프로젝트를 조회
            user = User.objects.get(id=owner_id)
            li = Member.objects.filter(user=user).values_list('project')
            print(li)
            projects = Project.objects.filter(project_id__in=li).order_by("-create_dt")

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 프로젝트 생성
    @transaction.atomic
    def post(self, request):

        try:
            # with transaction.atomic():
                print(request.POST)
                print(request.POST.get('event_dt'))
                event_dt = request.POST.get('event_dt')

                owner_id = request.POST.get('owner_id')
                print(owner_id)
                user = User.objects.get(id=owner_id)

                project = Project.objects.create(owner=user, title=request.POST.get('title'))
                # arr = event_dt.split("-")
                # arr = [int(i) for i in event_dt.split("-")]
                # from datetime import date
                # project.event_dt = date(2023, 1, 28)


                # todo: 현재 가정 - payer 는 카카오 로그인 유저임.


                member_li = json.loads(request.POST.get('member_li')) #member li 로 변경함

                print(member_li)

                for member in member_li:
                    print(member)
                    print(member.get('user'))
                    if member.get('user') is not None:
                        user = User.objects.get(id=member.get('user'))
                        Member.objects.create(project=project, username=member.get("username"), user=user)
                    else:
                        Member.objects.create(project=project, username=member.get("username"))

                members = Member.objects.filter(project=project)
                serializer1 = MemberSerializer(members, many=True).data
                serializer2 = ProjectSerializer(project).data

                if project:
                    return Response({"members":serializer1, "project":serializer2}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response( status=status.HTTP_400_BAD_REQUEST)

class end_project(APIView):
    # 프로젝트 종료
    def patch(self, request):
        try:
            project_id = request.POST.get("project_id")
            project = Project.objects.get(project_id=project_id)

            project.status = 1
            project.save()
            return Response({"status": 200}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"status":500, "err_code": e}, status=500)

class recover_project(APIView):
    # 프로젝트 종료 취소
    def patch(self, request):
        try:
            project_id = request.POST.get("project_id")
            project = Project.objects.get(project_id=project_id)

            project.status = 0
            project.save()
            return Response({"status": 200}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"status":500, "err_code": e}, status=500)


class member_join(APIView):
    # 프로젝트 멤버 조인
    def patch(self, request, project_id):
        try:
            project = Project.objects.get(project_id=project_id)
            user = User.objects.get(id=request.POST.get("user_id"))

            member_id = request.POST.get("member_id")
            if member_id is None:
                Member.objects.create(username=user.k_name,project=project,user=user)
            else:
                member = Member.objects.get(member_id=member_id)
                member.user = user
                member.save()

            members = Member.objects.filter(project=project)
            print(members)
            serializer = MemberSerializer(members, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

            project.status = 0
            project.save()
            return Response({"status": 200}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"status":500, "err_code": e}, status=500)

class ProjectAPI(APIView):
    # 프로젝트 조회
    def get(self, request, project_id):
        # delete_member_one_pay()

        project = Project.objects.get(project_id=project_id)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 프로젝트 수정
    @transaction.atomic()
    def patch(self, request, project_id):
        try:
            with transaction.atomic():
                print('.')
                project = Project.objects.get(project_id=project_id)
                print('..')

                print(request.POST.get('member_li'))

                member_li = json.loads(request.POST.get('member_li'))

                id_li = []
                for member in member_li:
                    print(member)
                    id = member.get("member_id")
                    print(id)
                    if id is None:
                        print('zz')
                        print(member.get("username"))
                        m = Member.objects.create(project=project, username=member.get("username"))
                        print('.......')
                        id_li.append(m.member_id)
                    else:
                        print('dd')
                        id_li.append(id)
                db_id_li = list(Member.objects.filter(project=project).values_list('member_id',flat=True))
                del_id_li = set(db_id_li) - set(id_li)
                for id in del_id_li:
                    Member.objects.get(member_id=id).delete()
                    ## 삭제시 관련된 페이멤버도 삭제 -> cascade로 처리됨.
                    ## 정산결과 업데이트, 정산 멤버업데이트, 페이멤버, 결제내역 업데이트되어야함.

                # delete_member_one_pay()
                # req_name_li = json.loads(request.POST.get('name_li'))
                # db_name_li = Member.objects.filter(project=project).values_list('username')
                #
                # add_name_li = set(req_name_li) - set(db_name_li)
                # del_name_li = set(db_name_li) - set(req_name_li)
                #
                # for name in add_name_li:
                #     Member.objects.create(project=project, username=name)
                # for name in del_name_li:
                #     Member.objects.get(project=project, username=name).delete()

                members = Member.objects.filter(project=project)
                print('members')
                print(members)
                serializer1 = MemberSerializer(members, many=True)

                print('.')
                print(request.POST.get("title"))
                title = request.POST.get("title")
                if title != project.title:
                    project.title = request.POST.get("title")
                    # project.update(title=request.POST.get("title"))
                    print('..')
                    project.save()
                    print('.,.')
                print('...')
                print('.../')
                #todo: event_dt, 수정


                serializer2 = ProjectSerializer(project)
                print('....')
            # if (serializer2.is_valid()):
            #     serializer1.save()
            #     serializer2.save()
                return Response({"members":serializer1.data, "project":serializer2.data}, status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 프로젝트 삭제
    def delete(self, request, project_id):
        try:
            project = Project.objects.get(project_id=project_id)
            project.delete()
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"err_msg":e}, status=status.HTTP_400_BAD_REQUEST)




class MemberAPI(APIView):
    # 멤버 정보 조회
    def get(self, request, id, project_id=None):
        try:
            if project_id is not None:
                # id 는 user id를 의미
                user = User.objects.get(id=id)
                project = Project.objects.get(project_id=project_id)
                member = Member.objects.get(project=project, user=user)
            else:
                # id 는 member id를 의미
                member = Member.objects.get(member_id=id)
            serializer = MemberSerializer(member)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"err_msg":e}, status=status.HTTP_400_BAD_REQUEST)

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
        # delete_member_one_pay()
        return Response({}, status=status.HTTP_204_NO_CONTENT)




class MemberListAPI(APIView):
    # 프로젝트 멤버 조회
    def get(self, request, project_id):
        print(project_id)
        project = Project.objects.get(project_id=project_id)
        members = Member.objects.filter(project=project)
        print(members)
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






class PayListAPI(APIView):
    # 프로젝트 페이 리스트 조회
    def get(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        pays = Pay.objects.filter(project=project)
        serializer = PaySerializer(pays, many=True)
        return Response(serializer.data)

    # 프로젝트 페이 생성
    @transaction.atomic()
    def post(self, request):
        try:
            with transaction.atomic():

                ## 나중-> 필드 값에 대한 백엔드 단의 예외처리
                ## 순서 지켜야함.
                project = Project.objects.get(project_id=request.POST.get('project'))
                #0. member 객체 없는 것들 먼저 생성 <- 중복 이름에 대처하기 위함
                payer = json.loads(request.POST.get('payer'))
                paymembers = json.loads(request.POST.get('pay_member'))

                print('payer')
                print(payer)

                if payer.get('member_id') is not None:
                    payer = Member.objects.get(member_id=payer['member_id'])
                else: #payer가 결제내역 탭에서 추된 참여자여서가 member_id가 없는 경우.
                    print('hi')
                    username = payer.get('username')
                    print(username)
                    payer = Member.objects.create(username=username,project=project)
                    print(payer)

                    # paymember에도 있으 변경해줌.
                    for paymember in paymembers:
                        if paymember.get('member_id') is None and paymember.get('username') == username:
                            paymember['member_id'] = payer.member_id
                            break
                print('.')

                for paymember in paymembers:
                    if paymember.get('member_id') is None:
                        username = paymember['username']
                        new_mem = Member.objects.create(project=project, username=username)

                        paymember['member_id'] = new_mem.member_id
                print('..')
                #1. pay 생성
                title = request.POST.get('title')
                money = request.POST.get('money')
                pay = Pay.objects.create(project=project,payer=payer,title=title,money=money)
                print('...')
                #2. pay_member 생성
                # todo: 리팩토링 필요.
                for paymember in paymembers:
                    member = Member.objects.get(member_id=paymember['member_id'])
                    PayMember.objects.create(pay=pay,member=member)
                print('....')
                serializer = PaySerializer(pay)
                pays = Pay.objects.filter(project=project)
                serializer1 = PaySerializer(pays, many=True)
                members = Member.objects.filter(project=project)
                serializer2 = MemberSerializer(members, many=True)
                print('.....')
                return Response({"pay":serializer.data, "pays":serializer1.data,"members":serializer2.data}, status=status.HTTP_200_OK)

        except Exception as e:
            print('페이 생성 오류 발생')
            print(request.POST)
            print(e)
            return Response(e, status=status.HTTP_400_BAD_REQUEST)



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
                print('.')
                pay = Pay.objects.get(pay_id=pay_id)
                print('..')
                print(json.loads(request.POST.get('payer')))
                payer = json.loads(request.POST.get('payer'))
                paymembers = json.loads(request.POST.get('paymembers'))

                if payer.get('member_id') is not None:
                    payer = Member.objects.get(member_id=payer['member_id'])
                else:  # payer가 결제내역 탭에서 추된 참여자여서가 member_id가 없는 경우.
                    username = payer.get('username')
                    payer = Member.objects.create(username=username, project=pay.project)
                    # paymember에도 있으 변경해줌.
                    for paymember in paymembers:
                        if paymember.get('member_id') is None and paymember.get('username') == username:
                            paymember['member_id'] = payer.member_id
                            break

                if payer.member_id != pay.payer:
                    pay.payer = payer

                member_li = paymembers
                print('...')

                title = request.POST.get("title")
                if title != pay.title:
                    pay.title = request.POST.get("title")
                    # project.update(title=request.POST.get("title"))
                    print('..')
                    pay.save()
                    print('.,.')
                money = request.POST.get("money")
                if title != pay.money:
                    pay.money = request.POST.get("money")
                    # project.update(title=request.POST.get("title"))
                    print('..........')
                    pay.save()
                    print('..,,,,,,,,,.')


                print(member_li)
                #paymember 생성
                id_li = []
                for member in member_li:
                    id = member.get("member_id")
                    if id is None:
                        print(member.get("username"))
                        m = Member.objects.create(project=pay.project, username=member.get("username"))
                        pm = PayMember.objects.create(pay=pay, member_id=m.member_id)
                        print('.......')
                        id_li.append(pm.paymember_id)
                    else:
                        m = Member.objects.get(member_id=id)
                        pm = PayMember.objects.get_or_create(pay=pay, member_id=m.member_id)[0]
                        id_li.append(pm.paymember_id)
                print('d')
                db_id_li = list(PayMember.objects.filter(pay=pay).values_list('paymember_id',flat=True))
                del_id_li = set(db_id_li) - set(id_li)
                print('dd')
                for id in del_id_li:
                    PayMember.objects.get(paymember_id=id).delete()

                print('dddd')


                paymembers = PayMember.objects.filter(pay=pay)
                paymember_s = PayMemberSerializer(data=paymembers, many=True)

                # delete_member_one_pay()

                serializer = PaySerializer(pay)
                print(".")

                # if serializer.is_valid():
                #     serializer.save()
                #
                #     req_mem_li = json.loads(request.POST.get('pay_member'))
                #     db_mem_li = PayMember.objects.filter(pay=pay).values_list('member_id')
                #
                #     add_mem_li = set(req_mem_li) - set(db_mem_li)
                #     del_mem_li = set(db_mem_li) - set(req_mem_li)
                #
                #     for mem_id in add_mem_li:
                #         PayMember.objects.create(pay__id=pay_id, member__id=mem_id)
                #     for mem_id in del_mem_li:
                #         PayMember.objects.get(pay__id=pay_id, member__id=mem_id).delete()
                #
                #     paymembers = PayMember.objects.filter(pay__id=pay_id)
                #     paymember_s = PayMemberSerializer(data=paymembers, many=True)

                # return Response({"pay":serializer.data,"pay_member":paymember_s}, status=status.HTTP_200_OK)
                return Response({"pay":serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # 프로젝트 페이 삭제
    def delete(self, request, pay_id):
        pay = Pay.objects.get(pay_id=pay_id)
        pay.delete()
        # delete_member_one_pay()
        return Response({}, status=status.HTTP_200_OK)

# 페이 멤버 리스트 조회 - 페이 기준
class get_pay_member_list(APIView):
    def get(self, request, pay_id):
        # print('................')
        # print(pay_id)
        # pay = Pay.objects.get(pay_id=pay_id)
        # print(pay)
        li = PayMember.objects.filter(pay__pay_id=pay_id).values_list('member')
        # print(li)
        members = Member.objects.filter(member_id__in=li)
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)

# 페이 멤버 리스트 조회 - 멤버 기준
class get_member_pay_list(APIView):
    def get(self, request, member_id):
        li = PayMember.objects.get(member_id=member_id).values_list('pay')
        pays = Pay.objects.filter(pay_id__in=li)
        serializer = PaySerializer(pays, many=True)
        return Response(serializer.data)




class kakao_logout(APIView):
    # 카카오 로그아웃
    def post(self, request):
        ADMIN_KEY = os.environ.get("ADMIN_KEY")
        Authorization = f'KakaoAK {ADMIN_KEY}'
        headers = {'Authorization': Authorization}

        k_id = request.POST.get('k_id')

        data = {
            "target_id": k_id,
            "target_id_type": "user_id",
        }

        kakao_logout_api = "https://kapi.kakao.com/v1/user/logout"

        logout_result = requests.post(kakao_logout_api, data=data, headers=headers).json()

        result = {'status': 200}

        if 'error' in logout_result:
            result['error'] = logout_result['error']
            result['status'] = 500
            return HttpResponse(json.dumps(result), content_type='application/javascript; charset=utf8')
        else:
            k_id = logout_result["id"]
            result['k_id'] = k_id
            return Response(result, status=200)


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


def calc_project(self, project_id):
    members = Member.objects.filter(project=project_id)
    pays = Pay.objects.filter(project=project_id)
    
    money_check = {member.member_id: 0 for member in members}
    members_detail = {}
    total_money = 0
    for member in members:
        members_detail[member.member_id] = {
            'participate_pay': [],
            'payed_pay': []
        }
    
    for pay in pays:
        pay_money = pay.money
        total_money += pay_money
        # 받을 사람
        money_check[pay.payer.member_id] += pay_money
        members_detail[pay.payer.member_id]['payed_pay'].append((pay.pay_id, pay_money))
        # 보낼 사람
        pay_members = list(PayMember.objects.filter(pay=pay.pay_id).values_list('member__member_id', flat=True))
        money_per_member = math.floor(pay_money / len(pay_members))

        # 만약 1원 단위로 딱 안떨어지면, 랜덤하게 1원씩 추가, 
        coins = pay_money - money_per_member * len(pay_members)
        # API 요청마다 달라지지 않게 시드 고정
        random.seed(project_id)
        # 1원 더 낼 멤버
        unlucky_member = random.sample(pay_members, coins)
        for pay_member in pay_members:
            members_detail[pay_member]['participate_pay'].append((pay.pay_id, pay.title, math.floor(pay_money / len(pay_members))))
            money_check[pay_member] -= math.floor(pay_money / len(pay_members))
            if pay_member in unlucky_member:
                money_check[pay_member] -= 1
    
    # 받을 사람 Queue
    get_pq = PriorityQueue()
    # 보낼 사람 Queue
    give_pq = PriorityQueue()
    for k, v in money_check.items():
        if v < 0:
            give_pq.put((v, k))
        if v > 0:
            get_pq.put((-1 * v, k))

    money_transfer = []
    while not give_pq.empty():
        target_money, get_member = get_pq.get()
        print('Target Money:', target_money, ' Get Member:', get_member)
        x, give_member = give_pq.get()
        print('  Give Money:', x, 'Give Member:', give_member)
        # 줘야할 돈이 받을돈보다 클 때
        if target_money > x:
            give_pq.put((x - target_money, give_member))
            money_transfer.append((get_member, give_member, -target_money))
        # 줘야할 돈이 받을돈보다 작거나 같을 때
        else:
            money_transfer.append((get_member, give_member, -x))
            get_pq.put((target_money - x, get_member))
        print(money_transfer[-1])

    response_json = {
        'status': 'success',
        'members': [MemberSerializer(member).data for member in members],
        'project_result': money_transfer,
        'members_detail': members_detail,
        'total_money': total_money
    }
    
    return JsonResponse(response_json, status=status.HTTP_200_OK)