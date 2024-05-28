from cryptography.fernet import Fernet
import os

# Generate a key for encryption and decryption
# You must store this key securely. Do not hardcode it in your code.
key = os.environ.get('key')
cipher_suite = Fernet(key)

def encrypt_message(message):
    encrypted_message = cipher_suite.encrypt(message.encode('utf-8'))
    return encrypted_message.decode('utf-8')

def decrypt_message(encrypted_message):
    decrypted_message = cipher_suite.decrypt(encrypted_message.encode('utf-8'))
    return decrypted_message.decode('utf-8')
