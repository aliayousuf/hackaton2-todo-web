import gradio as gr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from src.main import app  # Import your existing FastAPI app

# Add CORS middleware to your FastAPI app to allow requests from different origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins - you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a minimal Gradio interface to satisfy Hugging Face Spaces requirement
with gr.Blocks(title="Todo API") as demo:
    gr.Markdown("# Todo API Backend")
    gr.Markdown("FastAPI backend deployed on Hugging Face Spaces")
    gr.Markdown("- API documentation available at `/docs`")
    gr.Markdown("- Health check at `/health`")

# Mount the FastAPI app to the Gradio demo
demo.app = app

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)