import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'});

export const checkValidPrompt = async (prompt) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents:`The prompt is: "${prompt}". In the given prompt if the keyword 'application' or 'mail' is not present then display "false". Otherwise display "true". NOTE: Do not display description. Answer only in "true" or "false".`
        })
        return response.text.toLowerCase().trim()
    } catch (error) {
        console.log(error.message)        
    }
}