// import dotenv from 'dotenv';
// dotenv.config();
import { GoogleGenAI } from "@google/genai";

const api_key = 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'

const ai = new GoogleGenAI({apiKey: api_key})

export const makeSuggestion = async (topic) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Given topic is ${topic}. You need to tell display that what the things that user needs to do in order to execute the given task (topic). Give the user in a single parameter. Don't make a big paragraph just give simple and straight forward answer`
        })

        const resultedText = response.text;
        console.log(resultedText)
        return resultedText.trim()
    } catch (error) {
        console.log(error)
    }
}