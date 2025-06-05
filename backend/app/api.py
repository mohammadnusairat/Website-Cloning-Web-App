from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import uvicorn
import requests
import os
from openai import OpenAI
from dotenv import load_dotenv
from hyperbrowser import Hyperbrowser
from hyperbrowser.models import StartScrapeJobParams, ScrapeOptions
from urllib.parse import urljoin
from bs4 import BeautifulSoup

load_dotenv()

openAIClient = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create FastAPI instance
app = FastAPI(
    title="Orchids Challenge API",
    description="A starter FastAPI template for the Orchids Challenge backend",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Item(BaseModel):
    id: int
    name: str
    description: str = None

class ItemCreate(BaseModel):
    name: str
    description: str = None

class CloneRequest(BaseModel):
    url: str

# In-memory storage for demo purposes
items_db: List[Item] = [
    Item(id=1, name="Sample Item", description="This is a sample item"),
    Item(id=2, name="Another Item", description="This is another sample item")
]

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Hello from FastAPI backend!", "status": "running"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "orchids-challenge-api"}

# Get all items
@app.get("/items", response_model=List[Item])
async def get_items():
    return items_db

# Get item by ID
@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    for item in items_db:
        if item.id == item_id:
            return item
    return {"error": "Item not found"}

# Create new item
@app.post("/items", response_model=Item)
async def create_item(item: ItemCreate):
    new_id = max([item.id for item in items_db], default=0) + 1
    new_item = Item(id=new_id, **item.dict())
    items_db.append(new_item)
    return new_item

# Update item
@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: ItemCreate):
    for i, existing_item in enumerate(items_db):
        if existing_item.id == item_id:
            updated_item = Item(id=item_id, **item.dict())
            items_db[i] = updated_item
            return updated_item
    return {"error": "Item not found"}

# Delete item
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    for i, item in enumerate(items_db):
        if item.id == item_id:
            deleted_item = items_db.pop(i)
            return {"message": f"Item {item_id} deleted successfully", "deleted_item": deleted_item}
    return {"error": "Item not found"}

# helper function to stay under token limit
def safe_truncate(text, max_chars=6000):
    return text[:max_chars] if len(text) > max_chars else text

# Clone a website
@app.post("/clone")
async def clone_website(req: CloneRequest):
    # Step 1: Scrape using Hyperbrowser SDK
    client = Hyperbrowser(api_key=os.getenv("HYPERBROWSER_API_KEY"))
    try:
        scrape_result = client.scrape.start_and_wait(
            StartScrapeJobParams(
                url=req.url,
                scrape_options=ScrapeOptions(
                    formats=["html", "markdown", "links"],
                    only_main_content=False,
                    timeout=15000, # 15 second timeout
                    # wait_for=1500 # 1.5 second wait time
                )
            )
        )
    except Exception as e:
        return {"error": "Failed to scrape with Hyperbrowser", "details": str(e)}

    html = safe_truncate(scrape_result.data.html, 8000) or ""
    markdown = safe_truncate(scrape_result.data.markdown, 5000) or ""
    links = scrape_result.data.links or []
    title = scrape_result.data.metadata.get("title") if scrape_result.data.metadata else "Cloned Site"

    # Hyperbrowser doesn't return raw CSS, manually extract linked stylesheets
    soup = BeautifulSoup(html, "html.parser")
    css_snippets = []

    for link_tag in soup.find_all("link", rel="stylesheet"):
        href = link_tag.get("href")
        if href:
            full_url = urljoin(req.url, href)
            try:
                css_response = requests.get(full_url, timeout=5)
                if css_response.status_code == 200:
                    css_snippets.append(css_response.text)
            except:
                continue

    combined_css = "\n".join(css_snippets)

    css = safe_truncate(combined_css, 5000) or ""

    # Step 2: Ask GPT-4o to replicate using prompt
    prompt = f"""
    You are a web developer AI. Generate a single HTML file that replicates the aesthetics and structure of the following website.

    Use the provided HTML and CSS for layout and styling reference.
    Use the Markdown to understand the clean, readable content.
    Use the list of links to rebuild basic navigation elements if needed.

    Title: {title}

    HTML:
    {html}

    CSS:
    {css}

    Markdown:
    {markdown}

    Links:
    {links}

    Your output should be a complete, clean HTML page using inline or <style> CSS. Do not include JavaScript.
    """

    llm_response = openAIClient.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful AI that generates HTML websites from scraped content."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5, # fine-tuned balance between deterministic and improvising
        max_tokens=4000
    )

    generated_html = llm_response.choices[0].message.content
    return {"cloned_html": generated_html}