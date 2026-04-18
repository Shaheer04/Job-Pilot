# Use Python 3.12
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 7860

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    musl-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user early
RUN useradd -m -u 1000 user

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . /app/

# Ensure the log file exists and the user owns the directory
RUN touch /app/ai_errors.log && \
    mkdir -p /app/staticfiles && \
    chown -R user:user /app

# Switch to the non-root user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose the port
EXPOSE 7860

# Collect static files and start Gunicorn
CMD python manage.py collectstatic --no-input && \
    gunicorn jobpilot.wsgi:application --bind 0.0.0.0:7860
