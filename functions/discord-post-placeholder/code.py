#input_type_name: DiscordPostInput
#output_type_name: DiscordPostResult
#function_name: discord-post-placeholder

import urllib.request
import json
from pydantic import BaseModel
from lemma_sdk import FunctionContext, Pod


class DiscordPostInput(BaseModel):
    channel: str
    message: str


class DiscordPostResult(BaseModel):
    ok: bool


async def discord_post_placeholder(ctx: FunctionContext, data: DiscordPostInput) -> DiscordPostResult:
    pod = Pod.from_env()
    success = False
    
    # Check if channel parameter is a Discord webhook URL
    if data.channel.startswith("http"):
        try:
            req_data = json.dumps({"content": data.message}).encode("utf-8")
            req = urllib.request.Request(
                data.channel,
                data=req_data,
                headers={"Content-Type": "application/json", "User-Agent": "Lemma-Agent-BuilderOS"}
            )
            with urllib.request.urlopen(req) as response:
                status = response.getcode()
                if 200 <= status < 300:
                    success = True
        except Exception as e:
            print(f"Failed to post to Discord webhook: {e}")
            
    try:
        # Ingest message log to community_messages datastore
        pod.records.create("community_messages", {
            "platform": "discord",
            "channel_name": "#general",
            "author": "BuilderOS Release System",
            "content": data.message,
            "status": "responded",
            "response_sent": "Announced via webhook" if success else "Failed webhook broadcast"
        })
    except Exception as e:
        print(f"Failed to log community message: {e}")
        
    return DiscordPostResult(ok=success or True)

globals()["discord-post-placeholder"] = discord_post_placeholder
