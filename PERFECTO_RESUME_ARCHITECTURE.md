# "Perfecto" Resume Engine: Architectural Blueprint

## 1. Philosophy: The "Atomic" Resume
Stop treating the resume as a document. Treat it as a **relational database of career achievements**.
*   **Goal:** 100% consistency, zero hallucinations, and maximum ATS (Applicant Tracking System) compatibility.
*   **The Approach:** Use **Logical Assembly** and **Deterministic Scoring** instead of generative AI.

---

## 2. Phase 1: The Atomic Parser (High-Fidelity Extraction)
Instead of simple OCR, use a layout-aware parser to break the user's "Base Resume" into structured "Atoms."

*   **Logic:** Detect headers, dates, and bullet points.
*   **Data Structure:**
    ```json
    {
      "atom_id": "exp_001",
      "type": "experience",
      "company": "TechCorp",
      "content": "Scaled backend to 1M users using Python and Redis.",
      "keywords": ["python", "redis", "scalability", "backend"],
      "impact_score": 90
    }
    ```
*   **Tooling:** `pdfplumber` or `marker` (Python) for structural extraction.

---

## 3. Phase 2: The JD Fingerprint (Semantic Mapping)
Instead of asking AI "Is this a good match?", use **Vector Math**.

*   **Process:**
    1.  Convert the Job Description (JD) into a "Requirement Map."
    2.  Use **Embeddings** (e.g., `Sentence-Transformers`) to turn the JD and every "Atom" into mathematical vectors.
*   **The Advantage:** This is **deterministic**. The same JD and same Atom will *always* result in the same similarity score (e.g., 0.85).
*   **Consistency:** Zero "AI hallucinations" or randomness.

---

## 4. Phase 3: The Assembly Engine (Rule-Based Logic)
A Python engine that "builds" the resume using hardcoded career coaching rules.

*   **Rule 1 (Relevance):** Select the top 5 Atoms with the highest Similarity Scores to the JD.
*   **Rule 2 (Recency):** Always include at least 2 bullets from the most recent role to prevent "recency gaps."
*   **Rule 3 (The Hook):** The highest-scoring Atom *must* be the first bullet point of the first job.
*   **Rule 4 (Skill Density):** Populate the "Technical Skills" section *only* with keywords that appear in both the JD Fingerprint and the User's Vault.

---

## 5. Phase 4: The Polishing Layer (Surgical AI)
Use LLMs (Gemini/GPT-4) for **less than 5%** of the process.

*   **Constraint:** AI is only allowed to change **grammar, tense, and brevity**.
*   **Instruction:** "Start this bullet with a strong action verb and ensure it is in the past tense. Do not change the technical facts."
*   **Result:** A polished, professional tone that remains 100% truthful.

---

## 6. Phase 5: The "ATS-Gold" Renderer
Convert the final JSON assembly into a PDF.

*   **Template:** Use a clean, single-column, Boring™ layout.
*   **Why:** Recruiters and ATS systems hate complex "designer" layouts. A clean, standard structure wins 90% of the time.
*   **Tooling:** `WeasyPrint` or `Playwright` to convert HTML/CSS templates into high-quality PDFs.

---

## 7. Implementation Roadmap
1.  **Vault System:** Create a DB schema to store "Atoms."
2.  **Scoring Service:** Implement local vector embeddings for JD matching.
3.  **Assembly Script:** Write the Python logic to pick the "best" atoms for a specific job.
4.  **UI:** Build a "Before vs. After" dashboard to show the user exactly how their resume was logically improved.
