export const getHeadings = (markdownText) => {
    if (!markdownText) return [];

    const headingLines = markdownText.match(/^#{1,3} .+/gm) || [];
  
    return headingLines.map((raw) => {
        const level = raw.match(/^#+/)[0].length;
        const text = raw.replace(/^#+\s+/, '');
    
        const id = text
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\p{L}\p{N}-]/gu, '');  
    
        return { text, level, id };
    }); 
};