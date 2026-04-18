# Use Python 3.11
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 7860

# Set work directory
WORKDIR /app

# Install system dependencies for Postgres
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . /app/

# Hugging Face Spaces requires a user with UID 1000
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose the port HF Spaces expects (7860)
EXPOSE 7860

# Collect static files and start Gunicorn on port 7860
# We use 0.0.0.0 so it's accessible within the container network
CMD python manage.py collectstatic --no-input && \
    gunicorn jobpilot.wsgi:application --bind 0.0.0.0:7860
