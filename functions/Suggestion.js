// import dotenv from 'dotenv';
// dotenv.config();
import { GoogleGenAI } from "@google/genai";

const api_key = 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'

const ai = new GoogleGenAI({apiKey: api_key})

export const makeSuggestion = async (topic) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Display the nice and professional instructions how can someone perform the "${topic}" task. Display a single short and strait forward paragarph.`
        })

        const resultedText = response.text;
        console.log(resultedText)
        return resultedText.trim()
    } catch (error) {
        console.log(error)
    }
}