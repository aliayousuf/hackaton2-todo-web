from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, tasks, chat
import os

def create_app():
    app = FastAPI(
        title="Todo API",
        description="API for managing personal tasks with authentication",
        version="1.0.0"
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("ALLOWED_ORIGIN", "https://hackaton2-todo-web.vercel.app,http://localhost:3000").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router, prefix="/api", tags=["Authentication"])
    app.include_router(tasks.router, prefix="/api", tags=["Tasks"])
    app.include_router(chat.router, prefix="/api", tags=["Chat"])

    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo API"}

    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app

app = create_app()

# For development
def dev():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)