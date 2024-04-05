from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    pass


class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    post = models.CharField(max_length=450)
    poster = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posts")
    date = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)

    def formatted_dateListed(self):
        return self.date.strftime('%B %d, %Y %I:%M %p')


class Comment(models.Model):
    id = models.BigAutoField(primary_key=True)
    comment = models.CharField(max_length=400)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments")
    commenter = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments")
    pass


class followers(models.Model):
    id = models.BigAutoField(primary_key=True)
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers")


class Like(models.Model):
    id = models.BigAutoField(primary_key=True)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="like")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="likes")
    liked = models.BooleanField(default=False)
