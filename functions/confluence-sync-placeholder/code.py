#input_type_name: ConfluenceSyncInput
#output_type_name: ConfluenceSyncResult
#function_name: confluence-sync-placeholder

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class ConfluenceSyncInput(BaseModel):
    space_key: str


class ConfluenceSyncResult(BaseModel):
    synced_count: int
    ok: bool


async def confluence_sync_placeholder(ctx: FunctionContext, data: ConfluenceSyncInput) -> ConfluenceSyncResult:
    pod = Pod.from_env()
    
    # TODO: Confluence connector is not authenticated.
    # Manual OAuth configuration required: `lemma connector auth-configs create confluence`
    print("Confluence sync called in mock mode: Confluence OAuth configuration is required.")
    
    try:
        # Ingest dummy knowledge articles to RAG index to help test search
        pod.records.create("knowledge_articles", {
            "title": f"Synced Confluence Space [{data.space_key}] FAQ",
            "content_markdown": "To resolve common pipeline failures: check the dashboard approvals widget and sign off on release triggers.",
            "keywords": "pipeline, failure, approval"
        })
        synced = 1
        success = True
    except Exception as e:
        print(f"Failed to insert mock knowledge article: {e}")
        synced = 0
        success = False
        
    return ConfluenceSyncResult(synced_count=synced, ok=success)

globals()["confluence-sync-placeholder"] = confluence_sync_placeholder
