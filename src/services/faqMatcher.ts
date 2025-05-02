
import { faq } from "@/data/faq";
import { LLMResponse } from "./llm";

export function findFaqMatch(query: string): LLMResponse | null {
  // Convert query to lowercase for case-insensitive matching
  const normalizedQuery = query.toLowerCase().trim();
  
  // Find potential matches using basic string inclusion
  for (const item of faq) {
    const normalizedQuestion = item.question.toLowerCase();
    
    // Check if the query is contained in the question or vice versa
    if (normalizedQuestion.includes(normalizedQuery) || 
        normalizedQuery.includes(normalizedQuestion) ||
        // Check for key terms
        checkKeywordMatch(normalizedQuery, normalizedQuestion)) {
      return {
        text: item.answer,
        source: 'faq'
      };
    }
  }
  
  return null;
}

function checkKeywordMatch(query: string, question: string): boolean {
  // Extract key terms from the FAQ question
  const questionTerms = question
    .toLowerCase()
    .split(/\W+/)
    .filter(term => term.length > 3); // Filter out short words
  
  // Count how many key terms are in the query
  const matchedTerms = questionTerms.filter(term => 
    query.includes(term) && term.length > 3
  );
  
  // If more than 2 significant terms match, consider it a match
  // This threshold can be adjusted based on testing
  return matchedTerms.length >= 2;
}
