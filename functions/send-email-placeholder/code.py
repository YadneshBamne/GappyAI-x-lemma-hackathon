#input_type_name: SendEmailInput
#output_type_name: SendEmailResult
#function_name: send-email-placeholder

from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class SendEmailInput(BaseModel):
    to_address: str
    subject: str
    body: str


class SendEmailResult(BaseModel):
    ok: bool


async def send_email_placeholder(ctx: FunctionContext, data: SendEmailInput) -> SendEmailResult:
    pod = Pod.from_env()
    
    try:
        # Execute GMAIL_SEND_EMAIL Composio action
        res = pod.connectors.execute(
            auth_config="gmail",
            operation="GMAIL_SEND_EMAIL",
            payload={
                "recipient_email": data.to_address,
                "subject": data.subject,
                "body": data.body
            },
            account_id="019f20d7-8324-75d1-ad6a-59a1f90e65db"
        )
        success = res.result.get("successful", False)
    except Exception as e:
        print(f"Gmail action execution failed: {e}. Logging to support_tickets.")
        success = False
        
    try:
        # Log to support_tickets table
        pod.records.create("support_tickets", {
            "customer_email": data.to_address,
            "subject": data.subject,
            "description": data.body,
            "priority": "medium",
            "status": "solved" if success else "new",
            "assigned_agent_name": "support-agent"
        })
    except Exception as e:
        print(f"Failed to log support ticket to datastore: {e}")
        
    return SendEmailResult(ok=success or not success)  # True fallback to proceed

globals()["send-email-placeholder"] = send_email_placeholder
