import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'});

export const scheduleMeeting = async (time_and_date , title) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
            contents:`Schedule a google meeting for me on ${time_and_date}. The title for this meeting will be ${title}`
        })
        console.log(response.text.toLocaleLowerCase().trim())
        return response.text.toLowerCase().trim()
    } catch (error) {
        console.log(error.message)        
    }
}

scheduleMeeting('15th april 2025 at 7:30pm' , 'technical interview with aman')