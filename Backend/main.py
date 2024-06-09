# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime
import uuid
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GuestbookEntry(BaseModel):
    id: str = None
    name: str
    content: str
    created_at: str = None

guestbook_entries = []

@app.post("/guestbook/")
def create_entry(entry: GuestbookEntry):
    entry.id = str(uuid.uuid4())
    entry.created_at = datetime.now().isoformat()
    guestbook_entries.append(entry.dict())
    return entry

@app.get("/guestbook/")
def get_entries():
    return guestbook_entries

@app.delete("/guestbook/{entry_id}")
def delete_entry(entry_id: str):
    global guestbook_entries
    guestbook_entries = [entry for entry in guestbook_entries if entry["id"] != entry_id]
    return {"message": "Entry deleted successfully"}

frontend_directory = "/home/ubuntu/Final_Project/Frontend"
app.mount("/", StaticFiles(directory=frontend_directory, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8085, reload=True)