from PIL import Image
import io
from app.models.plant_model import predict

SOLUTIONS = {
    "Apple scab": {
        "chemical":   "Apply fungicides like captan or myclobutanil every 7-10 days",
        "organic":    "Use neem oil spray, remove and destroy fallen leaves",
        "prevention": "Plant resistant varieties, ensure good air circulation"
    },
    "Black rot": {
        "chemical":   "Apply copper-based fungicide every 7-10 days",
        "organic":    "Remove infected fruit and leaves immediately",
        "prevention": "Prune dead wood, avoid wetting foliage"
    },
    "Cedar apple rust": {
        "chemical":   "Apply myclobutanil fungicide in spring",
        "organic":    "Remove nearby juniper plants if possible",
        "prevention": "Plant resistant apple varieties"
    },
    "Early blight": {
        "chemical":   "Apply copper-based fungicide every 7-10 days",
        "organic":    "Neem oil spray, remove infected leaves immediately",
        "prevention": "Avoid overhead watering, ensure good air circulation"
    },
    "Late blight": {
        "chemical":   "Apply chlorothalonil or mancozeb fungicide",
        "organic":    "Remove and destroy infected plants, apply copper spray",
        "prevention": "Plant resistant varieties, avoid wet foliage"
    },
    "Leaf mold": {
        "chemical":   "Apply chlorothalonil fungicide",
        "organic":    "Improve ventilation, reduce humidity",
        "prevention": "Avoid overhead watering, space plants well"
    },
    "Septoria leaf spot": {
        "chemical":   "Apply mancozeb or chlorothalonil fungicide",
        "organic":    "Remove infected leaves, apply copper spray",
        "prevention": "Avoid wetting leaves, rotate crops yearly"
    },
    "Bacterial spot": {
        "chemical":   "Copper-based bactericide spray every 7 days",
        "organic":    "Remove infected leaves, avoid working with wet plants",
        "prevention": "Use disease-free seeds, rotate crops yearly"
    },
    "Powdery mildew": {
        "chemical":   "Apply sulfur-based or systemic fungicide",
        "organic":    "Neem oil spray, remove infected leaves",
        "prevention": "Ensure good air circulation, avoid overhead watering"
    },
    "Gray leaf spot": {
        "chemical":   "Apply strobilurin fungicide",
        "organic":    "Remove infected leaves, improve air circulation",
        "prevention": "Rotate crops, avoid overhead irrigation"
    },
    "Cercospora leaf spot gray leaf spot": {
        "chemical":   "Apply strobilurin or triazole fungicide",
        "organic":    "Remove infected leaves, improve air circulation",
        "prevention": "Rotate crops, avoid overhead irrigation"
    },
    "Common rust": {
        "chemical":   "Apply fungicides containing azoxystrobin",
        "organic":    "Remove infected leaves early",
        "prevention": "Plant resistant varieties, monitor regularly"
    },
    "Northern leaf blight": {
        "chemical":   "Apply propiconazole fungicide",
        "organic":    "Remove crop debris, apply neem oil",
        "prevention": "Rotate crops, use resistant hybrids"
    },
    "Haunglongbing": {
        "chemical":   "No cure available, remove infected trees immediately",
        "organic":    "Control Asian citrus psyllid with insecticidal soap",
        "prevention": "Use certified disease-free plants, monitor for psyllids"
    },
    "Isariopsis leaf spot": {
        "chemical":   "Apply mancozeb fungicide every 10 days",
        "organic":    "Remove infected leaves, apply copper spray",
        "prevention": "Ensure good air circulation, avoid wetting leaves"
    },
    "Leaf scorch": {
        "chemical":   "Apply appropriate fungicide based on severity",
        "organic":    "Remove infected leaves, improve drainage",
        "prevention": "Avoid water stress, ensure proper irrigation"
    },
    "Esca (black measles)": {
        "chemical":   "No effective chemical cure, prune infected wood",
        "organic":    "Remove and destroy infected wood immediately",
        "prevention": "Protect pruning wounds, use clean sterilized tools"
    },
    "Leaf blight (isariopsis leaf spot)": {
        "chemical":   "Apply mancozeb or copper fungicide",
        "organic":    "Remove infected leaves, apply neem oil",
        "prevention": "Avoid overhead watering, rotate crops"
    },
    "Mosaic virus": {
        "chemical":   "No chemical cure, remove and destroy infected plants",
        "organic":    "Control aphid vectors with insecticidal soap",
        "prevention": "Use virus-free seeds, control insect vectors"
    },
    "Yellow leaf curl virus": {
        "chemical":   "Control whitefly with systemic insecticides",
        "organic":    "Use reflective mulch, remove infected plants",
        "prevention": "Use resistant varieties, control whitefly population"
    },
    "Spider mites two-spotted spider mite": {
        "chemical":   "Apply miticide or insecticidal soap",
        "organic":    "Neem oil spray, introduce predatory mites",
        "prevention": "Maintain humidity, avoid water stress"
    },
    "Target spot": {
        "chemical":   "Apply chlorothalonil or mancozeb fungicide",
        "organic":    "Remove infected leaves, improve air circulation",
        "prevention": "Rotate crops, avoid overhead watering"
    },
    "Tomato mosaic virus": {
        "chemical":   "No chemical cure, remove infected plants",
        "organic":    "Wash hands and tools regularly, remove infected plants",
        "prevention": "Use resistant varieties, sterilize tools between plants"
    },
    "Bacterial blight": {
        "chemical":   "Apply copper-based bactericide",
        "organic":    "Remove infected plant parts, avoid overhead watering",
        "prevention": "Use disease-free seeds, rotate crops"
    },
    "Citrus greening": {
        "chemical":   "No cure, remove infected trees",
        "organic":    "Control psyllid insects with neem oil",
        "prevention": "Use certified disease-free trees, monitor regularly"
    },
    "Corn smut": {
        "chemical":   "Apply fungicide at early growth stages",
        "organic":    "Remove galls before they burst, destroy infected material",
        "prevention": "Plant resistant varieties, rotate crops"
    },
    "Fire blight": {
        "chemical":   "Apply copper bactericide or streptomycin during bloom",
        "organic":    "Prune infected branches 30cm below visible symptoms",
        "prevention": "Avoid excessive nitrogen, plant resistant varieties"
    },
    "Scab": {
        "chemical":   "Apply fungicide containing captan or mancozeb",
        "organic":    "Remove infected leaves and fruit, apply neem oil",
        "prevention": "Ensure good air circulation, avoid wetting foliage"
    },
    "Tomato yellow leaf curl virus": {
    "chemical":   "Control whitefly with systemic insecticides",
    "organic":    "Use reflective mulch, remove infected plants",
    "prevention": "Use resistant varieties, control whitefly population"
    },
    "Healthy": {
        "chemical":   "No treatment needed",
        "organic":    "No treatment needed",
        "prevention": "Maintain current care routine"
    }
}

SEVERITY = {
    "Apple scab":                              "moderate",
    "Black rot":                               "high",
    "Cedar apple rust":                        "moderate",
    "Early blight":                            "moderate",
    "Late blight":                             "high",
    "Leaf mold":                               "low",
    "Septoria leaf spot":                      "moderate",
    "Bacterial spot":                          "moderate",
    "Powdery mildew":                          "moderate",
    "Gray leaf spot":                          "moderate",
    "Cercospora leaf spot gray leaf spot":     "moderate",
    "Common rust":                             "moderate",
    "Northern leaf blight":                    "moderate",
    "Haunglongbing":                           "high",
    "Isariopsis leaf spot":                    "moderate",
    "Leaf scorch":                             "low",
    "Esca (black measles)":                    "high",
    "Leaf blight (isariopsis leaf spot)":      "moderate",
    "Mosaic virus":                            "high",
    "Yellow leaf curl virus":                  "high",
    "Spider mites two-spotted spider mite":    "moderate",
    "Target spot":                             "moderate",
    "Tomato mosaic virus":                     "high",
    "Bacterial blight":                        "moderate",
    "Citrus greening":                         "high",
    "Corn smut":                               "moderate",
    "Fire blight":                             "high",
    "Scab":                                    "moderate",
    "Tomato yellow leaf curl virus": "high",
    "Healthy":                                 "none"
}

from groq import Groq
import os

def generate_explanation(plant: str, disease: str, confidence: float, severity: str, solutions: dict) -> str:
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        prompt = f"""
        A plant disease detection AI analyzed a leaf image and found the following:
        - Plant: {plant}
        - Disease: {disease}
        - Confidence: {confidence * 100:.1f}%
        - Severity: {severity}
        - Recommended treatments:
          * Chemical: {solutions.get('chemical', 'N/A')}
          * Organic: {solutions.get('organic', 'N/A')}
          * Prevention: {solutions.get('prevention', 'N/A')}

        Write a clear, friendly 3-4 sentence explanation for a farmer who is not technical.
        Explain what the disease is, how serious it is, and what they should do.
        Do not use technical jargon. Be direct and helpful.
        """
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Groq API error: {e}")
        return f"Your {plant} plant has been detected with {disease}. Please follow the recommended treatments below."

async def predict_disease(file):
    contents = await file.read()
    img      = Image.open(io.BytesIO(contents))
    result   = predict(img)

    disease     = result["disease"]
    disease_key = disease.capitalize()

    solution = SOLUTIONS.get(disease_key, {
        "chemical":   "Consult a local agricultural expert",
        "organic":    "Remove affected parts and monitor plant",
        "prevention": "Maintain good plant hygiene"
    })
    severity = SEVERITY.get(disease_key, "moderate")

    # Generate natural language explanation
    explanation = generate_explanation(
        result["plant"], disease, result["confidence"], severity, solution
    )

    return {
        "status":          "success",
        "plant":           result["plant"],
        "disease":         disease,
        "confidence":      result["confidence"],
        "severity":        severity,
        "explanation":     explanation,
        "solutions":       solution,
        "top_predictions": result["top_predictions"]
    }