import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'});

export const checkValidPrompt = async (prompt) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents:`The prompt is: "${prompt}". Is this prompt suitable for generating an email using a mail generator? Answer only one word: true or false.`
        })
        return response.text.toLocaleLowerCase().trim()
    } catch (error) {
        console.log(error.message)        
    }
}
