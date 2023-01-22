from django.contrib import admin
from django.urls import path, include
from .views import *


urlpatterns = [


    path('kakao/callback', kakao_callback.as_view()),
    path('logout', kakao_logout.as_view()),

    path('users', UserListAPI.as_view()),
    path('users/<int:user_id>', UserAPI.as_view()),
    path('login',LoginAPI.as_view()),
    path('users/friends/<int:user_id>', FriendUserListAPI.as_view()),
    path('friends', FriendAPI.as_view()),
    path('projects', ProjectListAPI.as_view()),
    path('projects/<int:owner_id>', ProjectListAPI.as_view()),
    path('projects/project/<int:project_id>', ProjectAPI.as_view()),

    path('project/make/end', end_project.as_view()),

    # path('projects/project/restart/<int:project_id>', restart_project.as_view()),
    path('members/<int:project_id>', MemberListAPI.as_view()),
    path('members-multi', MemberListAPI.as_view()),
    path('members', MemberAPI.as_view()),
    # path('members/member/<int:membser_id>', MemberAPI.as_view()),
    path('pays', PayListAPI.as_view()),
    path('pays/<int:project_id>', PayListAPI.as_view()),
    path('pays/pay/<int:pay_id>', PayAPI.as_view()),
    path('paymembers/pay/<int:pay_id>', get_pay_member_list.as_view()),
    path('paymembers/member/<int:member_id>', get_member_pay_list),
    path('project-result/<int:project_id>', calc_project)
]