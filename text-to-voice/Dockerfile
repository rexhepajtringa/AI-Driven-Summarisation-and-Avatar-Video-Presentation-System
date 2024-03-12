# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app

# Install any needed packages specified in a requirements.txt file
# Ensure you have a requirements.txt file in the same directory as the Dockerfile
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run app.py when the container launches
CMD ["python", "./app.py"]
