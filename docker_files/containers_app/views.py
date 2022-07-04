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
    


def getFileContents(container_name, file_path):
    client = docker.from_env()
    container = client.containers.get(container_name)
    output = container.exec_run('cat '+ file_path).output.decode()
    return output


def container_view(request, name):
    init_system()
    container = Container.objects.get(name=name)
    root_dir = getDir(name, '/')
    container_object = json.dumps(model_to_dict(container))
    context = {
        'container': container,
        'container_object': container_object,
        "root_dir": root_dir
    }
    return render(request, 'container.html', context)


def home_view(request):
    init_system()
    containers = getContainers()
    context = {
        'containers': containers,
        'container_count': len(containers),
    }
    return render(request, 'list.html', context)


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
