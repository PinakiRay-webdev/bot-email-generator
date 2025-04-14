import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'});

export const checkGovernmental = async (prompt) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
            contents:`"${prompt}" is this prompt is targeting for governmental work or any of it's agencies? Display "true" or "false" only.`
        })
        return response.text.toLowerCase().trim()
    } catch (error) {
        console.log(error.message)        
    }
}
