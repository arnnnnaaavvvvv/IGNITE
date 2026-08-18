import sys
import os

# Add the apps/api directory to sys.path so that 'app' can be resolved by Vercel Serverless Functions
current_dir = os.path.dirname(os.path.abspath(__file__))
api_app_dir = os.path.abspath(os.path.join(current_dir, "..", "apps", "api"))
if api_app_dir not in sys.path:
    sys.path.insert(0, api_app_dir)

from app.main import app
