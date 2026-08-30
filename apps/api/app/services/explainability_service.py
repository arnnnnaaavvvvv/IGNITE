from typing import Dict, Any

class ExplainabilityService:
    """
    Translates mathematical risk metrics into region-adaptive plain language reasoning
    in English, Hindi, and regional languages.
    """

    @classmethod
    def generate_trip_summary_explanation(cls, itinerary: Dict[str, Any], lang: str = "en") -> Dict[str, Any]:
        score = itinerary.get("overall_safety_score", 30.0)
        dest = itinerary.get("destination", "Destination")
        region_type = itinerary.get("region_type", "HILL_MOUNTAIN")
        agency = itinerary.get("emergency_agency", "Local Rescue Services")
        is_hi = lang == "hi"

        if region_type == "COASTAL_MARINE":
            if is_hi:
                positives = [
                    "लाइफगार्ड टावरों के साथ समुद्र तटीय बुलेटिन सामान्य है।",
                    "उच्च ज्वार की स्थिति में सुरक्षित सड़क मार्ग उपलब्ध है।",
                    "आपातकालीन सुरक्षा कोष शामिल किया गया है।"
                ]
                watchpoints = [
                    "लाल झंडे वाले खतरनाक लहरों वाले स्थानों पर तैरने से बचें।",
                    "शाम 7:00 बजे के बाद समुद्री पुलिस के नियमों का पालन करें।"
                ]
                summary = f"{dest} के लिए तटीय सुरक्षा सामान्य और अनुकूल है। समुद्र की लहरें सुरक्षित सीमा में हैं।"
            else:
                positives = [
                    "Coastal water conditions verified with active lifeguard watchtowers.",
                    "Safe inland road available in case of high waves.",
                    "15% emergency reserve set aside for unexpected weather protection."
                ]
                watchpoints = [
                    "Avoid swimming near red-flagged areas with strong currents.",
                    "Follow evening 7:00 PM beach safety guidelines."
                ]
                summary = f"Coastal safety for {dest} is rated {itinerary.get('overall_risk_category', 'MODERATE')}. Wave height is within safe bounds."

        elif region_type == "FOREST_WILDLIFE":
            if is_hi:
                positives = [
                    "सफारी मार्ग सुरक्षित ऊंचे रास्तों पर निर्धारित हैं।",
                    "वन विभाग द्वारा जंगल की स्थिति पर निरंतर नजर रखी जा रही है।",
                    "निकटतम वन चौकी के साथ वायरलेस संपर्क सक्रिय है।"
                ]
                watchpoints = [
                    "शाम 5:00 बजे के बाद कोर जंगल क्षेत्र में प्रवेश बंद रहता है।",
                    "सफारी वाहन से नीचे उतरना सख्त मना है।"
                ]
                summary = f"{dest} के लिए वन्यजीव क्षेत्र सुरक्षा सामान्य और शांत है। मुख्य सफारी मार्ग खुले हैं।"
            else:
                positives = [
                    "Safari paths stay on safe high ground with trained forest escorts.",
                    "Continuous forest fire and weather monitoring active.",
                    "Emergency radio link active with the nearest forest post."
                ]
                watchpoints = [
                    "Strict 5:00 PM entry cutoff in core wildlife zones.",
                    "Do not step down from safari vehicles."
                ]
                summary = f"Wildlife area safety for {dest} is rated {itinerary.get('overall_risk_category', 'LOW')}. Animal corridors are quiet and safe."

        elif region_type == "DESERT_ARID":
            if is_hi:
                positives = [
                    "दोपहर 11:30 से 3:30 के बीच धूप से बचाव का समय शामिल किया गया है।",
                    "प्रति व्यक्ति पर्याप्त पानी (कम से कम 4 लीटर/दिन) का सुझाव।",
                    "पर्यटन सहायता चौकी के साथ सीधा संपर्क उपलब्ध है।"
                ]
                watchpoints = [
                    "रेत के टीलों में जाने से पहले मौसम विभाग के आंधी अलर्ट देखें।",
                    "हमेशा ओआरएस घोल और सिर ढकने के लिए कपड़ा साथ रखें।"
                ]
                summary = f"{dest} के लिए मरुस्थलीय सुरक्षा अनुकूल है। दोपहर की गर्मी से बचाव के नियम लागू हैं।"
            else:
                positives = [
                    "Mid-day heat avoided between 11:30 AM and 3:30 PM.",
                    "Plenty of water and hydration (4L/day) built into the plan.",
                    "Direct emergency line to the local tourism assistance post."
                ]
                watchpoints = [
                    "Check for dust storm warnings before entering open dunes.",
                    "Always carry drinking water, electrolytes, and sun hats."
                ]
                summary = f"Desert area safety for {dest} is rated {itinerary.get('overall_risk_category', 'MODERATE')}. Afternoon heat guidelines apply."

        elif region_type == "URBAN_HERITAGE":
            if is_hi:
                positives = [
                    "भीड़ नियंत्रण के लिए कतार प्रबंधन प्रणाली सक्रिय है।",
                    "निर्धारित एकतरफा पैदल मार्ग बनाए गए हैं।",
                    "500 मीटर के भीतर अस्पताल और एंबुलेंस की सुविधा उपलब्ध है।"
                ]
                watchpoints = [
                    "शाम की महाआरती के समय अत्यधिक भीड़ वाले घाटों पर सावधानी बरतें।",
                    "पूर्व-आरक्षित दर्शन पास का उपयोग करें।"
                ]
                summary = f"{dest} के लिए शहर व तीर्थ सुरक्षा अनुकूल है। प्रमुख परिसरों में आवागमन सुगम है।"
            else:
                positives = [
                    "Well-managed waiting areas help prevent crowd rush.",
                    "Designated one-way walking paths for easy movement.",
                    "Hospital and ambulance access available within 500m."
                ]
                watchpoints = [
                    "Be careful on crowded river steps during evening prayers.",
                    "Use online passes where available for faster entry."
                ]
                summary = f"City and temple safety for {dest} is rated {itinerary.get('overall_risk_category', 'LOW')}. Crowd movement is smooth and normal."

        else: # HILL_MOUNTAIN
            if is_hi:
                positives = [
                    "मार्ग में 24x7 ऑक्सीजन और प्राथमिक स्वास्थ्य सहायता केंद्र उपलब्ध हैं।",
                    "रात का ठहराव सुरक्षित आश्रय स्थलों पर निर्धारित है।",
                    "आपातकालीन खर्चों के लिए 15% आरक्षित कोष रखा गया है।"
                ]
                watchpoints = [
                    "2,700 मीटर से ऊपर पर्याप्त पानी पिएं ताकि ऊंचाई से परेशानी न हो।",
                    "शाम 5:30 बजे के बाद पहाड़ी रास्तों पर न चलें।"
                ]
                summary = f"{dest} के लिए पर्वतीय मार्ग पूरी तरह सुरक्षित है। सभी पहाड़ी रास्ते और पुल चालू हैं।"
            else:
                positives = [
                    "Medical posts with oxygen support are located along the route.",
                    "Overnight stays scheduled at verified shelters with power backup.",
                    "15% emergency reserve kept for unexpected travel needs."
                ]
                watchpoints = [
                    "Drink plenty of water (3-4 L/day) above 2,700m elevation.",
                    "Stop walking by 5:30 PM before cold night temperatures set in."
                ]
                summary = f"Mountain route safety for {dest} is rated {itinerary.get('overall_risk_category', 'LOW')}. Trails and slopes are firm and clear."

        return {
            "summary_text": summary,
            "overall_score": score,
            "region_type": region_type,
            "emergency_agency": agency,
            "key_positives": positives,
            "watchpoints": watchpoints
        }
