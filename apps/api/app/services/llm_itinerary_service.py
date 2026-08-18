import json
import httpx
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.core.config import settings

class LLMItineraryService:
    """
    Structured LLM Itinerary Synthesizer using Google Gemini API with deterministic fallback.
    Synthesizes day-by-day safety plans, pacing, and explainability reasoning.
    """

    @classmethod
    async def enrich_itinerary_with_llm(
        cls,
        base_itinerary: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Calls LLM to generate contextual safety reasoning and enriched logistics.
        """
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            # Deterministic rule-based synthesizer is already attached
            return base_itinerary

        prompt = f"""
        Act as an elite Indian Search and Rescue (SDRF) operations commander.
        Review this tourist itinerary:
        Destination: {base_itinerary.get('destination')} ({base_itinerary.get('state_ut')})
        Region Type: {base_itinerary.get('region_type')}
        Overall Risk Score: {base_itinerary.get('overall_safety_score')}/100 ({base_itinerary.get('overall_risk_category')})
        Emergency Agency: {base_itinerary.get('emergency_agency')}

        Generate a concise, authoritative natural language safety briefing and 2 positive route factors and 2 key watchpoints.
        Respond ONLY in JSON format:
        {{
            "summary_text": "...",
            "key_positives": ["...", "..."],
            "watchpoints": ["...", "..."]
        }}
        """

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"response_mime_type": "application/json"}
            }
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    text_resp = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = json.loads(text_resp)
                    base_itinerary["explainability"]["summary_text"] = parsed.get("summary_text", base_itinerary["explainability"]["summary_text"])
                    base_itinerary["explainability"]["key_positives"] = parsed.get("key_positives", base_itinerary["explainability"]["key_positives"])
                    base_itinerary["explainability"]["watchpoints"] = parsed.get("watchpoints", base_itinerary["explainability"]["watchpoints"])
        except Exception as e:
            print(f"[LLMItineraryService] LLM enrichment notice: {e}. Defaulting to verified deterministic reasoning.")

        return base_itinerary
