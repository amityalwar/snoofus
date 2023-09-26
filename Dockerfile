# Use an official Python runtime as the base image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set up a script to download the model
RUN echo "import whisper \n\
whisper.load_model('tiny.en')" > download_model.py

# Run the script to download the model
RUN python download_model.py


# Make port 5000 available to the world outside the container
EXPOSE 5000

# Define environment variable for gunicorn to bind
ENV BIND 0.0.0.0:5000

# Run app.py when the container launches using gunicorn for production
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
