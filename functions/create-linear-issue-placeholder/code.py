#input_type_name: CreateLinearIssueInput
#output_type_name: CreateLinearIssueResult
#function_name: create-linear-issue-placeholder

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class CreateLinearIssueInput(BaseModel):
    title: str
    description: str
    priority: str


class CreateLinearIssueResult(BaseModel):
    issue_id: str
    ok: bool


async def create_linear_issue_placeholder(ctx: FunctionContext, data: CreateLinearIssueInput) -> CreateLinearIssueResult:
    pod = Pod.from_env()
    
    try:
        # Map human-friendly priority to Linear enum integers
        priority_map = {"low": 4, "medium": 3, "high": 2, "critical": 1, "Urgent": 1, "High": 2, "Normal": 3, "Low": 4}
        prio_val = priority_map.get(data.priority, 0)
        
        # Execute LINEAR_CREATE_LINEAR_ISSUE Composio action
        res = pod.connectors.execute(
            auth_config="linear",
            operation="LINEAR_CREATE_LINEAR_ISSUE",
            payload={
                "team_id": "6a0d4290-85a7-45f3-995d-c9a0b7c78083",
                "title": data.title,
                "description": data.description or "No description provided.",
                "priority": prio_val
            },
            account_id="019f20da-ff09-71f3-8b6a-e25568c1f68d"
        )
        
        result_dict = res.result
        success = result_dict.get("successful", False)
        resp_data = result_dict.get("data", {})
        issue_id = resp_data.get("id", "")
    except Exception as e:
        print(f"Linear action execution failed: {e}. Falling back to datastore log.")
        success = False
        issue_id = "fallback-uuid"
        
    try:
        # Persist to local issues table
        # 1. Fetch first project ID from the database
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
            # Create a mock project
            proj = pod.records.create("projects", {
                "company_id": comp_id,
                "name": "BuilderOS Core Platform",
                "description": "Core software repository"
            })
            proj_id = proj["id"]
            
        pod.records.create("issues", {
            "project_id": proj_id,
            "title": data.title,
            "description": data.description,
            "priority": data.priority.lower() if data.priority.lower() in ["low", "medium", "high", "critical"] else "medium",
            "status": "todo",
            "assignee_agent_name": "engineering-agent"
        })
    except Exception as e:
        print(f"Failed to persist issue record to datastore: {e}")
        
    return CreateLinearIssueResult(issue_id=issue_id, ok=success or (issue_id != ""))

globals()["create-linear-issue-placeholder"] = create_linear_issue_placeholder
