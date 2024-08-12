# Use the official Python image from the Docker Hub
FROM python:3.10

# Set the working directory in the container
WORKDIR /ws

# Copy the requirements file into the container
COPY ./requirements.txt /ws/requirements.txt

# Install the required dependencies
RUN pip install --no-cache-dir -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# Copy the rest of the application code into the container
COPY ./ /ws/

# Expose the port that the app runs on
EXPOSE 8000

CMD ["CD", "/ws/app"]

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
