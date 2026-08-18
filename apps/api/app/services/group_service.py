import math
from typing import List, Dict, Any

class GroupTrackingService:
    """
    Real-time tracking of family / trekking group members with automatic separation detection.
    """

    @classmethod
    def evaluate_group_dispersion(
        cls,
        leader_loc: Dict[str, float],
        members: List[Dict[str, Any]],
        separation_threshold_m: float = 150.0
    ) -> Dict[str, Any]:
        """
        Evaluates distance of all group members relative to group leader.
        """
        leader_lat = leader_loc.get("lat", 30.6380)
        leader_lon = leader_loc.get("lon", 79.0712)
        
        evaluated_members = []
        separated_count = 0
        
        for m in members:
            m_lat = m.get("lat", leader_lat)
            m_lon = m.get("lon", leader_lon)
            
            # Haversine distance in meters
            dlat = math.radians(m_lat - leader_lat)
            dlon = math.radians(m_lon - leader_lon)
            a = (
                math.sin(dlat / 2) ** 2 +
                math.cos(math.radians(leader_lat)) * math.cos(math.radians(m_lat)) * math.sin(dlon / 2) ** 2
            )
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            dist_m = round(6371000 * c, 1)
            
            is_separated = dist_m > separation_threshold_m
            if is_separated:
                separated_count += 1
                
            evaluated_members.append({
                "user_id": m.get("user_id", "usr_anon"),
                "name": m.get("name", "Member"),
                "role": m.get("role", "MEMBER"),
                "lat": m_lat,
                "lon": m_lon,
                "altitude_m": m.get("altitude_m", 2700),
                "battery_pct": m.get("battery_pct", 85),
                "distance_from_leader_m": dist_m,
                "is_separated": is_separated,
                "status": "SEPARATED_ALERT" if is_separated else "IN_FORMATION"
            })

        return {
            "total_members": len(members) + 1, # + leader
            "separated_count": separated_count,
            "group_status": "SCATTERED_WARNING" if separated_count > 0 else "SAFE_FORMATION",
            "threshold_m": separation_threshold_m,
            "leader_location": leader_loc,
            "members": evaluated_members
        }
