from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    pass


class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    post = models.CharField(max_length=450)
    poster = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posts")
    date = models.DateTimeField(default=timezone.now)
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
    date = models.DateTimeField(default=timezone.now)

    def formatted_dateListed(self):
        return self.date.strftime('%B %d, %Y %I:%M %p')


class Follower(models.Model):
    id = models.BigAutoField(primary_key=True)
    follower = models.ForeignKey(
        User, related_name='following', on_delete=models.CASCADE)
    followed_user = models.ForeignKey(
        User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        # Ensure uniqueness of follower-followed_user pair
        unique_together = ('follower', 'followed_user')

    # def __str__(self):
    #     return f"{self.follower} follows {self.followed_user}"


class Like(models.Model):
    id = models.BigAutoField(primary_key=True)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="like")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="likes")
    liked = models.BooleanField(default=False)

    class Meta:
        # Ensure uniqueness of  post-user pair
        unique_together = ('post', 'user')
