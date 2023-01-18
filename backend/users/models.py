from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    class Meta:
        db_table = 'auth_user'
    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = ['']

    # def __str__(self):
    #     return str(self.nom_asentamiento)

    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(blank=True, null=True)
    username = models.CharField(max_length=16, blank=True, null=True)
    password = models.CharField(max_length=16, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    k_id = models.IntegerField(blank=True, null=True)
    k_mail = models.EmailField(blank=True, null=True)
    k_name = models.CharField(max_length=100)

    kakao = models.BooleanField(default=False)