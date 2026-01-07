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

Answer the following questions about the structural architecture of this signal. Return your response as valid JSON with no additional text, markdown formatting, or explanation.

{{questions}}

---

## RESPONSE FORMAT

Return only a JSON object with the following structure:
```json
{
  "energy": "...",
  "state": "...",
  "orientation": "...",
  "substrate": "...",
  "ontological_states": ["value1", "value2", ...],
  "symbolic_elements": ["value1", "value2", ...],
  "subsystems": ["value1", "value2", ...],
  "dominant_language": ["value1", "value2", ...]
}
```

**Field definitions:**
- `energy`: One word or short phrase describing energetic quality (e.g., 'grounded', 'turbulent', 'focused', 'scattered')
- `state`: One word or short phrase describing condition/phase (e.g., 'stable', 'transitional', 'rupturing', 'integrating')
- `orientation`: Short directional phrase (e.g., 'toward sovereignty', 'building infrastructure', 'navigating constraints')
- `substrate`: 2-3 sentence description of the underlying thesis or architecture being held
- `ontological_states`: Array of 2-4 ontological conditions (e.g., 'sovereign', 'embedded', 'coherent', 'transitional')
- `symbolic_elements`: Array of symbolic/archetypal elements (e.g., 'threshold', 'grid', 'ocean', 'fire')
- `subsystems`: Array of engaged subsystems (e.g., 'cognitive', 'ethical', 'somatic', 'infrastructural')
- `dominant_language`: Array of language domains (e.g., 'technical', 'ecological', 'architectural', 'ontological')

Do not include extra explanation.  
Return only valid JSON.  
Use clear, structured language.  
Avoid narrative embellishment or emotional overlay.  
Stay in signal precision.
