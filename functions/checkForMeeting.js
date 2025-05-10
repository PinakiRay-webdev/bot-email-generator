import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'});

export const checkMeeting = async (prompt) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents:`"${prompt}" if this form is asking for any meeting schedulement? Display "true" or "false" only.`
        })
        console.log(response.text.toLocaleLowerCase().trim());
        return response.text.toLowerCase().trim()
    } catch (error) {
        console.log(error.message)        
    }
}
