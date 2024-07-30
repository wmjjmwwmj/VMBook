from http import HTTPStatus
import dashscope
import time
import os
from pathlib import Path
from dotenv import load_dotenv
import base64, uuid, io, json
from PIL import Image
from passlib.context import CryptContext
import requests

load_dotenv()


dashscope.api_key = os.environ.get('QWEN_API_KEY')
STATIC_PATH = os.getenv("STATIC_PATH") 
STATIC_SERVER = os.getenv("STATIC_SERVER")

def describe_image(image_url):
    
    image_url = image_url.replace(STATIC_SERVER, '')
    url = str(Path(STATIC_PATH).parent / str(Path(image_url).relative_to('/')))
    messages = [
        {
            "role": "user",
            "content": [
                {"image": url},
                {"text": "Please describe what you see in this image."}
            ]
        }
    ]
    
        
    response = dashscope.MultiModalConversation.call(model='qwen-vl-plus',
                                                      messages=messages)
    # Extracting the description
    if response["output"]["choices"][0]["message"]["content"]:
        description = response["output"]["choices"][0]["message"]["content"][0]["text"]
        return description
    else:
        return None

    return description


def hash_pwd(password: str) -> str:
    pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
    return pwd_context.hash(password)

# def string2url(base64string: str) -> str:
#     if base64string.startswith('data:image/jpeg;base64,'):
#         base64string = base64string.replace('data:image/jpeg;base64,', '')
#         img_type = 'jpeg'
#     elif base64string.startswith('data:image/png;base64,'):
#         base64string = base64string.replace('data:image/png;base64,', '')
#         img_type = 'png'
#     else: 
#         return None
    
#     img_data = base64.b64decode(base64string)
    
#     try:
#         # Calculate actual image dimensions
#         with Image.open(io.BytesIO(img_data)) as img:
#             width, height = img.size
#             # Optionally resize or process the image here

#         img = Image.frombytes(img_type, (width, height), img_data)

#         # ... (rest of your code)
#     except (ValueError, OSError) as e:
#         print(f"Error processing image: {e}")
#         return None
    
