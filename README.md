# Network: A Social Media Web App

This project is from the CS50 Web course. It's a small and humble project with a frontend built using HTML, CSS, Bootstrap, and vanilla JavaScript. The backend is powered by Django, a Python framework.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## Introduction
This project was created as part of the CS50 Web Development program. The goal was to develop a minimalistic social media application focusing on simplicity with minimal dopamine hits through a careful choice of colors and features.

## Features
- User Authentication (Sign up, Login, Logout)
- View Followers and Following
- Private Chat Messaging
- Like and Comment on Posts
- View and Surf General Posts
- Responsive Design

## Installation
Steps to install and set up the project locally.

### Prerequisites
- Python 3.x
- Django
- Gunicorn
- PostgreSQL (or another preferred database)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/yoni-shewas/network
   cd network ```
2. ``` bash
      pip3 install -r requirements.txt
3. ```bash
      python3 manage.py runserver
4. or with gunicorn
   ```bash
      pip3 install gunicorn
      gunicorn network.wsgi:application --bind 0.0.0.0:8000
      ```

## Usage
This app is a less cluttered and focus-oriented social media concept designed to enhance user experience without overwhelming them.

## Contact

- Github - https://github.com/yoni-shewas/network
- Email - yonatanmekuriya@gmail.com

