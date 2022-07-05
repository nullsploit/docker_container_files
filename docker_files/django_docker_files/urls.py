"""django_docker_files URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from containers_app import views
from .func import init_system

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),
    path('container/<name>/', views.container_view, name='container_url'),
    path('login/', views.login_view, name='login_url'),
    path('logout/', views.logout_view, name='logout_url'),

    path('api/get_directory/<container_name>/', views.api_container_dir, name='api_get_directory_url'),
    path('api/file_contents/<container_name>/', views.api_get_file_contents, name='api_get_file_contents_url'),
    path('api/write_file_contents/<container_name>/', views.api_write_file_contents, name='api_write_file_contents_url'),
]

init_system()
# views.runHostCommand("ls /home/nullsploit/Documents/DEV/django_docker_files/docker_files")