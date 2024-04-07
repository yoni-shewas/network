# Pull base image
FROM python:3.10

ENV PYTHONUNBUFFERED = 1
# Set environment variables
# ENV PIP_DISABLE_PIP_VERSION_CHECK 1
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# RUN apt update
# RUN apt -y install software-properties-common
# RUN add-apt-repository ppa:deadsnakes/ppa -y
# RUN apt update
# RUN apt -y install python3.8 python3-pip 

# Set work directory
WORKDIR /project4

# Install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . .

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]


