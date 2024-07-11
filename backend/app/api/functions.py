from http import HTTPStatus
import dashscope
import time
import os
from dotenv import load_dotenv
import base64
from PIL import Image

load_dotenv()


dashscope.api_key = os.environ.get('QWEN_API_KEY')


def describe_image(image_url):
    messages = [
        {
            "role": "user",
            "content": [
                {"image": image_url},
                {"text": "Please describe what you see in this image."}
            ]
        }
    ]
    
    response = dashscope.MultiModalConversation.call(model='qwen-vl-plus',
                                                      messages=messages)
    return response


def hash_pwd(password: str) -> str:
    return hash(password)

def string2url(base64string: str, photo_id: str) -> str:
    if base64string.startswith('data:image/jpeg;base64,'):
        base64string = base64string.replace('data:image/jpeg;base64,', '')
    else: 
        return None
    
    img_data = base64.b64decode(base64string)
    img = Image.frombytes('RGB', (256, 256), img_data)
    
    img.save(f'../img_db/{photo_id}.png', 'PNG')
    
    url = f'../img_db/{photo_id}.png'
    
    return url