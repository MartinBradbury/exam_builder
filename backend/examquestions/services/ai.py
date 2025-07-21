from openai import OpenAI
from django.conf import settings
import json

client = OpenAI (api_key = settings.OPEN_AI_KEY)

def generate_questions(topic, exam_board, number_of_questions):
    prompt = f"""
    You are a qualified teacher creating exam questions for the {exam_board} exam board.

    Create {number_of_questions} exam-style questions on the topic: "{topic}" for the {exam_board} specification.

    For each question:
    - Write the question clearly, and include the **total number of marks** at the end of the question in brackets like this: [3 marks]
    - Provide a detailed **mark scheme** that clearly states what the correct answer is, and how each mark is awarded.
      - For example: "1 mark for mentioning enzymes are biological catalysts"
      - Avoid vague labels like "Point 1" or "Point 2" — instead write what a correct student answer might say and how many marks it's worth.
    - Ensure the difficulty and format align with real {exam_board} exam questions.
    - Return only valid JSON with no commentary or extra explanation.

    Format:
    {{
        "questions": [
            {{
                "question": "Explain how enzymes function. [3 marks]",
                "total_marks": 6,
                "mark_scheme": [
                    "They lower activation energy of reactions – 1 mark",
                    "They are not used up during the reaction – 1 mark",
                    "They have a specific active site for substrates – 1 mark"
                ]
            }},
            ...
        ]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Return valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1500
    )

    content = response.choices[0].message.content.strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print("Invalid JSON from OpenAI:", content)
        raise e

def evaluate_response_with_openai(question, mark_scheme, user_answer):
    import json

    total_marks = sum(1 for line in mark_scheme if "mark" in line.lower())  # crude estimate if needed

    prompt = f"""
    You are a qualified examiner marking a student's response to an exam question.

    The question is:
    "{question}"

    Here is the official mark scheme:
    {json.dumps(mark_scheme, indent=2)}

    The student's answer is:
    "{user_answer}"

    Use the mark scheme to award a score **out of the total number of marks**, being fair but not overly strict:
    - If the answer is conceptually correct or uses alternative phrasing (e.g. "cell membranes" instead of "cell membrane structure"), accept it.
    - Allow synonyms and near-miss terms if the idea is clearly understood.
    - Award partial marks for partially correct or incomplete answers.
    - If something is close but not quite right, deduct only part marks and explain why.

    Respond ONLY in this JSON format:
    {{
    "score": <integer>,
    "out_of": <total_marks>,
    "feedback": "Explain why this mark was given, mentioning any good points and what was missing."
    }}
    """


    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a strict but fair exam marker. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        content = response.choices[0].message.content.strip()
        return json.loads(content)

    except Exception as e:
        print("OpenAI error:", e)
        print("Prompt content:\n", prompt)
        raise e

def get_feedback_from_openai(prompt):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful A-level biology examiner. "
                    "Respond ONLY in valid JSON with this exact structure:\n"
                    "{\n"
                    "  \"strengths\": [\"point1\", \"point2\", \"point3\"],\n"
                    "  \"improvements\": [\"point1\", \"point2\", \"point3\"]\n"
                    "}\n\n"
                    "Each array must have exactly 3 short bullet-point strings. "
                    "Do not include anything outside of the JSON object."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.6,
        max_tokens=500
    )

    raw_content = response.choices[0].message.content.strip()
    try:
        parsed = json.loads(raw_content)
        # Ensure keys exist
        return {
            "strengths": parsed.get("strengths", []),
            "improvements": parsed.get("improvements", [])
        }
    except json.JSONDecodeError:
        # fallback: return raw string if GPT fails to return JSON
        return {
            "strengths": [],
            "improvements": [],
            "raw": raw_content
        }