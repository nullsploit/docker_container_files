from django.contrib.auth.models import AbstractUser
from django.db import models


class Container(models.Model):
    name = models.CharField(max_length=100)
    image = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    started_at = models.DateTimeField(auto_now_add=True)


class UserContainer(models.Model):
    read = models.BooleanField(default=False)
    write = models.BooleanField(default=False)
    container = models.ForeignKey('Container', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)


class User(AbstractUser):
    containers = models.ManyToManyField(Container, blank=True, through='UserContainer', related_name='user_containers')
