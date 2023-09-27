# syntax=docker/dockerfile:1

FROM python:3.9.16-slim

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN apt-get clean
RUN apt-get update && apt-get install -y git
RUN apt-get -y install libopencv-dev
RUN python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt



COPY . .

CMD [ "python3", "main.py"]