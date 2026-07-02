#input_type_name: PublishNotesInput
#output_type_name: PublishNotesResult
#function_name: publish-notes-placeholder

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class PublishNotesInput(BaseModel):
    content: str


class PublishNotesResult(BaseModel):
    ok: bool


async def publish_notes_placeholder(ctx: FunctionContext, data: PublishNotesInput) -> PublishNotesResult:
    pod = Pod.from_env()
    success = False
    
    try:
        # Fetch first project ID from the database
        projects_resp = pod.records.list("projects", limit=1)
        proj_id = projects_resp.items[0]["id"] if projects_resp.items else None
        if not proj_id:
            # Fetch or create company
            comp_resp = pod.records.list("companies", limit=1)
            comp_id = comp_resp.items[0]["id"] if comp_resp.items else None
            if not comp_id:
                comp = pod.records.create("companies", {
                    "name": "BuilderOS"
                })
                comp_id = comp["id"]
            proj = pod.records.create("projects", {
                "company_id": comp_id,
                "name": "BuilderOS Core Platform",
                "description": "Core software repository"
            })
            proj_id = proj["id"]
            
        # Ingest record to releases table
        pod.records.create("releases", {
            "project_id": proj_id,
            "version_tag": "v1.0.1",
            "release_notes_markdown": data.content
        })
        success = True
    except Exception as e:
        print(f"Failed to publish release notes to datastore: {e}")
        
    return PublishNotesResult(ok=success)

globals()["publish-notes-placeholder"] = publish_notes_placeholder
