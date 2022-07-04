FROM python

WORKDIR /docker_files

COPY ./docker_files ./

RUN pip install django
RUN pip install docker
RUN pip install xtarfile

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]