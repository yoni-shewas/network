from django.test import TestCase
from .models import User, Follower, Post, Like

# Create your tests here.


class FollowerTestCase(TestCase):
    def setUp(self):
        # create users
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(username='user2')

        Follower.objects.create(followed_user=self.user1, follower=self.user2)
        Follower.objects.create(followed_user=self.user1, follower=self.user1)
        Follower.objects.create(followed_user=self.user2, follower=self.user1)

    def test_valid_follower(self):
        self.setup()
        user1 = User.objects.get(username='user1')
        user2 = User.objects.get(username='user2')

        follower = Follower.objects.get(
            followed_user=user1.id, follower=user2.id)
        followerBack = Follower.objects.get(
            followed_user=user2.id, follower=user1.id)

        self.assertEqual(follower.followed_user.id, user1.id)
        self.assertEqual(follower.follower.id, user2.id)

        self.assertEqual(followerBack.followed_user.id, user2.id)
        self.assertEqual(followerBack.follower.id, user1.id)

    def test_invalid_follower(self):

        follower = Follower.objects.get(
            followed_user=self.user1.id, follower=self.user1.id)
        self.assertFalse(follower.is_valid_follower())
        self.assertNotEqual(follower.followed_user.id, follower.follower.id)
