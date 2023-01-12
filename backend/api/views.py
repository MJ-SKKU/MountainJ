from queue import PriorityQueue
from django.shortcuts import render
from .serializer import *
from django.contrib.auth import login, authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import *

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
    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        # todo - ProjectMember 바로 owner 인지 확인 ?
        li = Member.objects.filter(user=user).values_list('project')
        projects = Project.objects.filter(project_id__in=li)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    # 프로젝트 생성
    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        reqData = request.data
        title = reqData['title']
        #todo: pwd
        project = Project.objects.create(owner_id=user, title=title)
        Member.objects.create(project=project,user=user)

        serializer = ProjectSerializer(project)

        if project:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(reqData, status=status.HTTP_400_BAD_REQUEST)



class ProjectAPI(APIView):
    # 프로젝트 조회
    def get(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    # 프로젝트 수정
    def patch(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 프로젝트 삭제
    def delete(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        project.delete()
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class MemberListAPI(APIView):
    # 프로젝트 멤버 리스트 조회
    def get(self, request, project_id):
        project = Project.objects.get(project_id=project_id)
        members = Member.objects.filter(project=project)
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)
    # 프로젝트 멤버 생성
    def post(self, request, project_id):
        # request.POST._mutable = True
        # request.POST['test'] = "test~"
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 프로젝트 멤버 삭제
class MemberAPI(APIView):
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
    def post(self, request, project_id):
        serializer = PaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PayAPI(APIView):
    # 프로젝트 페이 조회
    def get(self, request, pay_id):
        pay = Pay.objects.get(pay_id=pay_id)
        serializer = PaySerializer(pay)
        return Response(serializer.data)

    # 프로젝트 페이 수정
    def patch(self, request, pay_id):
        pay = Pay.objects.get(pay_id=pay_id)
        serializer = PaySerializer(pay, data=request.data, partial=True)
        if (serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 프로젝트 페이 삭제
    def delete(self, request, pay_id):
        pay = Pay.objects.get(pay_id=pay_id)
        pay.delete()
        return Response({}, status=status.HTTP_204_NO_CONTENT)

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


def calc_project(project_id):
    members = Member.objects.filter(project=project_id)
    pays = Pay.objects.filter(project=project_id)
    
    money_check = {member.member_id: 0 for member in members}
    for pay in pays:
        pay_money = pay.money
        # 받을 사람
        money_check[pay.payer] += pay_money
        # 보낼 사람
        pay_members = PayMember.objects.filter(pay=pay.pay_id).values_list('member', flat=True)
        for pay_member in pay_members:
            money_check[pay_member] -= pay_money / len(pay_members)
    
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
        target_money, get_member_id = -1 * get_pq.get()
        x, give_member_id = give_pq.get()

        if target_money - x > 0:
            give_pq.put((x - target_money), )
            money_transfer.append(get_member_id, give_member_id, x - target_money)
        else:
            money_transfer.append(get_member_id, give_member_id, x - target_money)
            target_money -= x
            get_pq.put((target_money, target_money))

    response_json = {
        'status': 'success',
        'memebers': members,
        'project_result': money_transfer
    }
    return response_json