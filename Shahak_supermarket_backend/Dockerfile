FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy project
COPY . .

# Expose port used by the Flask app
EXPOSE 5000

# Run the app with gunicorn
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "--workers", "1"]
