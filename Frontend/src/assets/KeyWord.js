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
        "will", "Will", "would", "Would", "shall", "Shall",
        "should", "Should", "may", "May", "might", "Might",
        "must", "Must",
        "ought", "Ought", "used", "Used",
        "need", "Need", "dare", "Dare",
        "want", "Want", "wish", "Wish", "like", "Like",
        "prefer", "Prefer", "love", "Love", "hate", "Hate",


        // Adverbs & Misc
        "very", "Very", "really", "Really", "quite", "Quite", "just", "Just",
        "too", "Too", "also", "Also", "even", "Even", "only", "Only",
        "not", "Not", "no", "No", "yes", "Yes",
        "here", "Here", "there", "There", "where", "Where", "when", "When",
        "why", "Why", "how", "How",
        "this", "This", "that", "That", "these", "These", "those", "Those",
        "such", "Such", "some", "Some", "any", "Any",
        "all", "All", "both", "Both", "each", "Each",
        "every", "Every", "few", "Few", "many", "Many",
        "most", "Most", "other", "Other", "several", "Several",
        "own", "Own", "same", "Same", "so", "So",
        "then", "Then", "thus", "Thus",
        "Can", "can", "Could", "could", "Will", "will",
        "Would", "would", "Shall", "shall", "Should", "should",

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
        "of", "Of", "to", "To", "in", "In", "on", "On",
        "at", "At", "for", "For", "with", "With", "about", "About",
        "against", "Against", "between", "Between", "under", "Under",
        "over", "Over", "after", "After", "before", "Before",
        "help", "Help", "need", "Need", "want", "Want",
        "time", "Time", "day", "Day", "year", "Year",
        "week", "Week", "month", "Month", "hour", "Hour",
        "minute", "Minute", "second", "Second",
        "thing", "Thing", "place", "Place", "person", "Person",
        "takes", "Takes", "makes", "Makes", "goes", "Goes",
        "comes", "Comes", "says", "Says", "sees", "Sees",
        "wants", "Wants", "needs", "Needs", "likes", "Likes",
        "opens", "Opens", "closes", "Closes", "starts", "Starts",
        "open", "Open", "close", "Close", "start", "Start",
        "stop", "Stop", "play", "Play", "pause", "Pause",
        "cannot", "Cannot", "could not", "Could not", "would not", "Would not",
        "should not", "Should not", "might not", "Might not",
        "using", "Using", "used", "Used", "use", "Use",
        "used to", "Used to", "used to be", "Used to be",
        "ask", "Ask", "tell", "Tell", "say", "Say",
        "Ask", "ask", "Tell", "tell", "Say", "say",

        //a to z
        "a", "b", "c", "d", "e", "f", "g", "h", "i",
        "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
        "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I",
        "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
        "T", "U", "V", "W", "X", "Y", "Z",
        //numbers
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        //punctuation
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")",
        "-", "_", "=", "+", "{", "}", "[", "]", "|",
        ";", ":", "'", "\"", "<", ">", ",", ".", "?",
        "/", "\\", "`", "~",


        //html tags
        "html", "head", "body", "title", "meta", "link", "script",
        "style", "div", "span", "p", "a", "img", "ul", "ol",
        "li", "table", "tr", "td", "th", "thead", "tbody",
        "footer", "header", "section", "article", "aside",
        "nav", "form", "input", "button", "select", "option",
        "label", "textarea", "br", "hr", "blockquote", "code",
        "pre", "iframe", "canvas", "svg", "path", "circle",
        "rect", "line", "polyline", "polygon", "ellipse",
        "g", "defs", "use", "symbol", "text", "tspan",
        "tref", "textPath", "marker", "linearGradient",
        "radialGradient", "stop", "pattern", "filter",
        "href", "src", "alt", "title", "class", "id",
        "hr", "br", "div", "span", "strong", "em",
        "b", "i", "u", "s", "mark", "small",
    ]);

    // Define multi-word keywords to count
    const keywords = [
        "big o",
        "time complexity",
        "space complexity",
        "dynamic programming",
        "depth-first search",
        "breadth-first search",
        "divide and conquer",
        "greedy algorithms",
    ];

    // Check if text contains <img src="data:image/
    if (text.includes('<img src="data:image/')) {
        return {}; // Return an empty object if it contains the image tag
    }

    // Normalize the text
    const normalizedText = text
        .toLowerCase()
        .replace(/[0-9]+/g, '') // Remove numbers
        .replace(/[\W_]+/g, ' ') // Replace non-word characters with spaces
        .trim();

    // Create an object to hold the keyword counts
    const keywordCount = {};

    // Count occurrences of multi-word keywords first
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g'); // Create a regex for the keyword
        const matches = normalizedText.match(regex); // Match the keyword in the text

        if (matches) {
            keywordCount[keyword] = matches.length; // Count occurrences
        }
    });

    // Split the text into words for single word counting
    const words = normalizedText.split(/\s+/);

    // Count occurrences of single words, excluding keywords
    words.forEach(word => {
        if (!commonWords.has(word) && word.length > 0 && !keywords.includes(word)) { // Ignore common words and keyword phrases
            keywordCount[word] = (keywordCount[word] || 0) + 1;
        }
    });

    return keywordCount;
}

export { countKeywords };