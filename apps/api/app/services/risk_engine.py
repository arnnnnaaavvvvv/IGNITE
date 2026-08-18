from typing import List, Dict, Any, Optional
from app.services.adaptive_risk_engine import AdaptiveRiskEngine

class RiskEngine:
    """
    Backward-compatible proxy delegating to Pan-India AdaptiveRiskEngine.
    """
    @classmethod
    def evaluate_checkpoint_risk(
        cls,
        checkpoint: Dict[str, Any],
        weather: Optional[Dict[str, Any]] = None,
        hazard_zones: List[Dict[str, Any]] = None,
        daily_ascent_m: int = 400
    ) -> Dict[str, Any]:
        region_type = checkpoint.get("region_type", "HILL_MOUNTAIN")
        return AdaptiveRiskEngine.evaluate_checkpoint_risk(
            checkpoint=checkpoint,
            region_type=region_type,
            hazard_zones=hazard_zones,
            weather=weather,
            daily_ascent_m=daily_ascent_m
        )
