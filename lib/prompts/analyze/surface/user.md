## SIGNAL

**Type:** {{signal_type}}  
**Title:** {{signal_title}}  
**Context:** {{signal_context}}  
**Date:** {{signal_date}}  
**Summary:** {{signal_summary}}
{{signal_annotations}}

---

**Context Key:**
- CAPTURE: Generic documentation, intent to be determined
- NOTE: Quick capture, ephemeral thought
- JOURNAL: Reflective writing, daily log
- CODE: Technical artifact, implementation
- REFERENCE: External source, citation
- OBSERVATION: Field note, documented reality
- ARTIFACT: Created work, finished piece

---

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
  "environment": "...",
  "temperature": 0.0,
  "density": 0.0,
  "actions": ["value1", "value2", ...],
  "entities": [
    {"name": "...", "type": "person|place|project|system", "context": "..."},
    ...
  ],
  "tags": ["value1", "value2", ...]
}
```

**Field definitions:**
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
