## SIGNAL

**Type:** {{signal_type}}  
**Context:** {{signal_context}}  
**Date:** {{signal_date}}
{{signal_annotations}}

{{signal_content}}

---

## TASK

Answer the following questions about this signal. Return your response as valid JSON with no additional text, markdown formatting, or explanation.

{{questions}}

---

## RESPONSE FORMAT

Return only a JSON object with the following structure:
```json
{
  "title": "...",
  "summary": "...",
  "environment": "...",
  "temperature": 0.0,
  "density": 0.0,
  "actions": ["value1", "value2", ...],
  "entities": [
    {"name": "...", "type": "people|animals|places|infrastructure|organizations|concepts|media", "context": "..."},
    ...
  ],
  "tags": ["value1", "value2", ...]
}
```

**Field definitions:**
- `title`: Clear, descriptive title under 10 words
- `summary`: Third-person narrative summary of what happened
- `environment`: Text description of physical/digital setting (max 500 chars)
- `temperature`: 0.0-1.0 (intensity/volatility of the signal)
- `density`: 0.0-1.0 (information density)
- `actions`: Array of concrete actions taken or described
- `entities`: Array of named people, places, projects, or systems with context
- `tags`: Array of 3-7 semantic tags

Do not include extra explanation.  
Return only valid JSON.  
Avoid decorative formatting or framing language.  
Keep tone neutral, structured, and precise.
