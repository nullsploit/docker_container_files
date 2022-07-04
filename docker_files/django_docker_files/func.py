import docker
import datetime
from containers_app.models import *


def getContainers():
    client = docker.from_env()
    container_list = []
    current_index = 1
    for container in client.containers.list():
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
            'started_at': datetime.datetime.strptime(container.attrs['State']['StartedAt'].split('.')[0], "%Y-%m-%dT%H:%M:%S"),
        }
        container_list.append(container_obj)
        current_index += 1
    return container_list


def init_system():
    container_names = []
    for container_object in getContainers():
        container_names.append(container_object['name'])
        try:
            container = Container.objects.get(name=container_object['name'])
            container.image = container_object['image']
            container.status = container_object['status']
            container.started_at = container_object['started_at']
            container.save()
        except:
            container = Container(
                name=container_object['name'],
                image=container_object['image'],
                status=container_object['status'],
                started_at=container_object['started_at'],
            )
            container.save()
            pass
    for ctnr in Container.objects.all():
        if ctnr.name not in container_names:
            ctnr.delete()

