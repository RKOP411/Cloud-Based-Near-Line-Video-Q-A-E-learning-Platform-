function countKeywords(text) {
    // Define common words to ignore
    const commonWords = new Set([
        // Articles
        "a", "A", "an", "An", "the", "The",

        // Pronouns
        "i", "I", "you", "he", "she", "it", "we", "they",
        "me", "him", "her", "us", "them",
        "my", "your", "his", "its", "our", "their",
        "mine", "yours", "hers", "ours", "theirs",
        "myself", "yourself", "himself", "herself", "itself", "ourselves", "yourselves", "themselves",

        // Prepositions
        "in", "In", "on", "On", "at", "At", "by", "By", "for", "For",
        "with", "With", "about", "About", "against", "Against", "between", "Between",
        "under", "Under", "over", "Over", "after", "After", "before", "Before",
        "to", "To", "from", "From", "up", "Up", "down", "Down", "into", "Into",
        "through", "Through", "across", "Across", "around", "Around",

        // Conjunctions
        "and", "And", "but", "But", "or", "Or", "so", "So", "yet", "Yet",
        "for", "For", "nor", "Nor", "because", "Because", "since", "Since",
        "although", "Although", "though", "Though", "while", "While",
        "if", "If", "unless", "Unless", "until", "Until",

        // Auxiliary/Modal Verbs
        "is", "Is", "am", "Am", "are", "Are", "was", "Was", "were", "Were",
        "be", "Be", "being", "Being", "been", "Been",
        "have", "Have", "has", "Has", "had", "Had",
        "do", "Do", "does", "Does", "did", "Did",
        "can", "Can", "could", "Could", "will", "Will",
        "would", "Would", "shall", "Shall", "should", "Should",
        "may", "May", "might", "Might", "must", "Must",

        // Adverbs & Misc
        "very", "Very", "really", "Really", "quite", "Quite", "just", "Just",
        "too", "Too", "also", "Also", "even", "Even", "only", "Only",
        "not", "Not", "no", "No", "yes", "Yes",
        "here", "Here", "there", "There", "where", "Where", "when", "When",
        "why", "Why", "how", "How",
        "this", "This", "that", "That", "these", "These", "those", "Those",

        // Other
        "as", "As", "like", "Like", "than", "Than", "such", "Such",
        "some", "Some", "any", "Any", "all", "All", "both", "Both",
        "each", "Each", "every", "Every", "few", "Few", "many", "Many",
        "most", "Most", "other", "Other", "several", "Several",
        "own", "Own", "same", "Same", "so", "So", "then", "Then", "thus", "Thus",
        "what", "What", "which", "Which", "who", "Who", "whom", "Whom",
        "whose", "Whose", "wherever", "Wherever", "whenever", "Whenever",
        "however", "However", "whether", "Whether", "why", "Why",
        "how", "How", "that", "That", "what", "What",
        "which", "Which", "who", "Who", "whom", "Whom",
        "whose", "Whose", "where", "Where", "when", "When",
        "why", "Why", "how", "How",
        "that", "That", "what", "What", "which", "Which",
    ]);
    // Normalize the text by lowering case and removing punctuation and numbers
    const normalizedText = text
        .toLowerCase()
        .replace(/[0-9]+/g, '') // Remove numbers
        .replace(/[\W_]+/g, ' ') // Replace non-word characters with spaces
        .trim();

    // Split the text into words
    const words = normalizedText.split(/\s+/);

    // Create an object to hold the word counts
    const wordCount = {};

    // Count the occurrences of each word
    words.forEach(word => {
        if (!commonWords.has(word) && word.length > 0) { // Ignore common words
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    return wordCount;
}

export { countKeywords };