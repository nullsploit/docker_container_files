from django.forms import model_to_dict
from django.shortcuts import render
import docker
import datetime
from django_docker_files.func import init_system
from .models import *
# import the redirect function
from django.shortcuts import redirect
# import the JsonResponse function
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import random
import os
from django.contrib.auth import authenticate, login, logout



def createSuperUser():
    # try:
    #     user = User.objects.all().first()
    #     user.set_password("admin")
    #     user.save()
    # except Exception as e:
    #     print(e)
    # return

    # check if user already exists
    if len(User.objects.all()) > 0:
        print("EXISTING USER FOUND")
        return
    else:
    # create a new user
        user = User(
            username='admin',
            email='admin@admin.com',
        )
        user.set_password('admin')
        user.save()



# create a decorator to make sure the user is logged in
def login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
        else:
            return redirect('login_url')
    return wrapper
 

def getContainers():
    client = docker.from_env()
    container_list = []
    current_index = 1
    for container in client.containers.list(all=True):
        image = client.images.get(container.attrs['Config']['Image'])
        image_name = image.tags[0] if len(image.tags) > 0 else ""
        started_at = container.attrs['State']['StartedAt'].split('.')[0]
        started_at = datetime.datetime.strptime(started_at, "%Y-%m-%dT%H:%M:%S")
        started_at = datetime.datetime.now() - started_at
        started_at = str(started_at).split('.')[0]

        container_obj = {
            "index": current_index,
            'name': container.name,
            'image': image_name,
            'status': container.status,
            'up_time': started_at,
        }
        container_list.append(container_obj)
        current_index += 1
    return container_list


def clearTempFiles():
    os.system("rm -rf /docker_container_files/tmp/*")


def getDir(container_name, directory):
    client = docker.from_env()
    container = client.containers.get(container_name)
    output = container.exec_run('ls -ahp ' + directory).output.decode()
    dq = '"'
    lbrace = "{"
    rbrace = "}"
    # print(output)
    output = output.split('\n')
    for item in output:
        if len(item) < 1:
            output.remove(item)
    return output


def runHostCommand(command):
    res = os.system(f"""echo "{command}" > /docker/pipe""")
    print("RES", res)
    # var = f"""echo "{command}" > /docker/pipe"""
    # print(var)


@login_required
def writeFile(container_name, file_path, file_contents):
    clearTempFiles()
    try:
        # file_contents = file_contents.replace('"', "'")
        client = docker.from_env()
        container = client.containers.get(container_name)

        # create a temporary file
        # temp_file = f"/tmp_files/tmp_{random.randint(0, 100000)}{random.randint(0, 100000)}.tmpfile"
        temp_file = f"/docker_container_files/tmp/tmp_{random.randint(0, 100000)}{random.randint(0, 100000)}.tmpfile"
        with open(temp_file, 'w') as f:
            f.write(file_contents)
        # run a system command on the current system
        # os.system(f"docker cp {temp_file} {container_name}:{file_path}")
        runHostCommand(f"docker cp {temp_file} {container_name}:{file_path}")
        # remove the temporary file
        # os.remove(temp_file)
        return True



    except Exception as e:
        print(e)
        return False
    

@login_required
def getFileContents(container_name, file_path):
    client = docker.from_env()
    container = client.containers.get(container_name)
    output = container.exec_run('cat '+ file_path).output.decode()
    return output


def login_view(request):
    createSuperUser()
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        print(username, password)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login_url')


@login_required
def container_view(request, name):
    createSuperUser()
    init_system()
    containers = getContainers()
    container = Container.objects.get(name=name)
    root_dir = getDir(name, '/')
    container_object = json.dumps(model_to_dict(container))
    context = {
        'containers': containers,
        'container': container,
        'container_object': container_object,
        "root_dir": root_dir
    }
    return render(request, 'container.html', context)


@login_required
def home_view(request):
    createSuperUser()
    init_system()
    containers = getContainers()
    context = {
        'containers': containers,
        'container_count': len(containers),
    }
    return render(request, 'list.html', context)


@login_required
def api_container_dir(request, container_name):
    print(container_name)
    if not request.method == "GET":
        return JsonResponse({"status": False, "message": "Method not allowed"})
    if 'dir' not in request.GET:
        return JsonResponse({"status": False, "message": "No directory specified"})
    try:
        container = Container.objects.get(name=container_name)
        dir = request.GET['dir']
    except:
        return JsonResponse({"status": False, "message": "Could not find container"})
    root_dir = getDir(container_name, dir)
    return JsonResponse({"status": True, "items": root_dir})

@csrf_exempt
@login_required
def api_write_file_contents(request, container_name):
    print(container_name)
    if not request.method == "POST":
        return JsonResponse({"status": False, "message": "Method not allowed"})
    # check if file_path in body as json object
    try:
        # print(request.body)
        json_data = json.loads(request.body.decode())
        file_path = json_data['file_path']
        file_contents = json_data['file_contents']
    except Exception as e:
        print(e)
        return JsonResponse({"status": False, "message": "internal error"})
    except:
        return JsonResponse({"status": False, "message": "Could not find container"})
    try:
        writeFile(container_name, file_path, file_contents)
        return JsonResponse({"status": True, "message": "File written"})
    except Exception as e:
        print(e)
        return JsonResponse({"status": False, "message": "Could not write file"})
    

def api_docker_power(request, container_name):
    pass


@login_required
def users_view(request):
    containers = getContainers()
    context = {
        'containers': containers,
    }
    return render(request, 'users.html', context)


@csrf_exempt
@login_required
def api_users(request):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body.decode())
            user_id = data['id']
            username = data['username']
            password = data['password']
            user = User.objects.get(id=user_id)
            if not password == "******":
                print("changing password to", password)
                user.set_password(password)
            if not username == user.username:
                print("changing username to", username)
                user.username = username
            user.save()
            return JsonResponse({"status": True, "message": "User updated"})
        except:
            return JsonResponse({"status": False, "message": "User not found"})
    elif request.method == "PUT":
        try:
            data = json.loads(request.body.decode())
            username = data['username']
            password = data['password']
            is_active = True if data['is_active'] == "true" else False
        except Exception as e:
            print(e)
            return JsonResponse({"status": False, "message": "Invalid request, parameters missing"})
        user = User(
            username=username,
            is_active=is_active,
        )
        user.set_password(password)
        try:
            user.save()
            return JsonResponse({"status": True, "message": "User created"})
        except:
            return JsonResponse({"status": False, "message": "User already exists"})
    elif request.method == "GET":
        users_list = []
        for user in User.objects.all():
            user_obj = {
                "id": user.id,
                'username': user.username,
                "password": "******",
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
            }
            users_list.append(user_obj)

        return JsonResponse({
            "status": True, 
            "users": users_list
        })
    else:
        return JsonResponse({"status": False, "message": "Method not allowed"})

@login_required
def api_get_file_contents(request, container_name):
    print(container_name)
    if not request.method == "GET":
        return JsonResponse({"status": False, "message": "Method not allowed"})
    if 'file_path' not in request.GET:
        return JsonResponse({"status": False, "message": "No directory specified"})
    try:
        container = Container.objects.get(name=container_name)
        file_path = request.GET['file_path']
    except:
        return JsonResponse({"status": False, "message": "Could not find container"})
    file_contents = getFileContents(container_name, file_path)
    return JsonResponse({"status": True, "contents": file_contents})
