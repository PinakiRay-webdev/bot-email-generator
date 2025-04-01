import {GoogleGenAI} from '@google/genai'


export const generateFORM = async (api_key , subject) =>{
    const ai = new GoogleGenAI({apiKey : api_key})
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents : `What could be the possible input fields for an email if the subject is ${subject}? Provide me 9 fields. NOTE: ONLY MEANINGFUL KEYWORDS I WANT, NOT DESCRIPTIONS. DO NOT GIVE ME IN BULLET POINTS. Don't give me any optional field. Separate each suggestion with ',' and ensure relevance. Include 'To' and 'From' as the first two fields. Never provide 'Subject' or 'Tone'. Provide Date where date is required according to subject. otherwise exclude the date. Always include 'Reason' as the last field.`
    });

    const responseArray = response.text.split(',')
    console.log(responseArray)
    return responseArray
}
