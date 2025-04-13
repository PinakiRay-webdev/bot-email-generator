import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'});

export const checkViolence = async (prompt) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
            contents:`"${prompt}" is it hatefull or violence prompt? Display "true" or "false" only.`
        })
        console.log(response.text.toLowerCase().trim())
        return response.text.toLowerCase().trim()
    } catch (error) {
        console.log(error.message)        
    }
}
